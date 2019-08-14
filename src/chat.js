/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';
import { throttle } from 'lodash';
import { Offline, Online } from "react-detect-offline";
import { addMessage, addfirstMessage, setUserName } from './actions';
const mapStateToProps = state => {
    return {
        userName: state.userName,
        groupMessage: state.groupMessage
    };
}
class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.reconnectingInterval = null;
        this.isFirstMessage = true;
        this.chatRef = React.createRef();
        this.state = {
            messageText: '',
            isVisible: true,
            isOffline: false,
            unsendMessages: []
        };
        this.notifyMeThrottled = throttle(this.notifyMe, 1000 * 60 * 30);

    }
    componentDidMount() {
        // this.props.dispatch(setUserName(localStorage.getItem('userName')));
        this.connecting();
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
    }
    componentWillUnmount() {
        window.removeEventListener('online', this.handleConnectionChange);
        window.removeEventListener('offline', this.handleConnectionChange);
    }
    handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'offline') {
            this.setState({
                isOffline: true
            })
        }
        else {
            this.sendOfflineMessages();
            this.setState({
                isOffline: false
            })
        }
    }
    connecting() {
        this.client = new WebSocket('ws://st-chat.shas.tel');
        this.isFirstMessage = true;
        this.client.onopen = () => {
            if (this.reconnectingInterval != null) {
                clearInterval(this.reconnectingInterval);
                this.reconnectingInterval = null;
                console.log('Conection is reestablished')
            }
            else {
                console.log('Connection is established');
            }
            // setTimeout(() => this.client.close(), 10000)
        };
        this.client.onmessage = (message) => {
            if (this.state.isVisible === false) {
                this.notifyMeThrottled();
            }
            if (this.isFirstMessage) {
                this.props.dispatch(addfirstMessage(JSON.parse(message.data)));
                this.isFirstMessage = false;
                this.scrollToBottom();
            }
            else {
                this.props.dispatch(addMessage(JSON.parse(message.data)));
                this.scrollToBottomIfNeeded();
            }
        };
        this.client.onclose = () => {
            console.log('WebSocket Client Closed');
            clearInterval(this.reconnectingInterval);
            this.reconnectingInterval = setInterval(() => {
                console.log('trying to reconnect');
                this.connecting();
            }, 2000)
        }
    }
    scrollToBottomIfNeeded() {
        if (this.chatRef.current.scrollTop - this.chatRef.current.children[this.chatRef.current.children.length - 1].offsetTop > -800) {
            this.scrollToBottom();
        }
    }
    scrollToBottom = () => {
        this.chatRef.current.scrollTo({
            top: this.chatRef.current.scrollHeight,
            behavior: 'auto'
        })
    };
    handleSubmit = event => {
        event.preventDefault();
        if (this.state.isOffline === false) {

            this.sendMessage(this.props.userName, this.state.messageText);
        } else {
            this.setOfflineMessage();
        }
        this.setState({
            messageText: ''
        })
    }
    sendMessage(from, message) {
        this.client.send(JSON.stringify({
            from: from,
            message: message
        }))
    }
    sendOfflineMessages() {
        if (this.state.unsendMessages.length !== 0) {
            this.state.unsendMessages.forEach((element) => {
                this.sendMessage(element.from, element.message);
            })
            this.setState({
                unsendMessages: []
            })
        }
    }
    setOfflineMessage() {
        this.setState({
            unsendMessages: this.state.unsendMessages.concat({
                from: this.props.userName,
                message: this.state.messageText
            })
        })
    }
    handleMessageChange = event => {
        this.setState({
            messageText: event.target.value
        })
    }
    handleNickNameChange = event => {
        // this.setState({
        //     userName: event.target.value
        // });
        this.props.dispatch(setUserName(event.target.value));

    }
    handleVisibilityChange = isVisible => {
        this.setState({
            isVisible: isVisible
        })
    }
    notifyMe() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        else if (Notification.permission === "granted") {
            var notification = new Notification("You recieved new message(s)!");
        }

        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification("You recieved new message(s)!");
                }
            });
        }
    }
    render() {
        return (
            <PageVisibility onChange={this.handleVisibilityChange}>
                <div className="chatWindow">
                    <Offline >
                        <div className="statusWrapper">
                            <p className="offline">Offline mode </p>
                        </div>
                    </Offline>
                    <Online>
                        <div className="statusWrapper">
                            <p className="online">Online mode </p>
                        </div>
                    </Online>
                    <ul className="chat" id="chatList" ref={this.chatRef}>
                        {
                            this.props.groupMessage.map(data => (
                                <li key={data.id} className='other'>
                                    <div className='msg whiteBackground'>
                                        <p>{data.from}</p>
                                        <div className='message'>{data.message}</div>
                                        <time>{new Date(data.time).toLocaleTimeString()}</time>
                                    </div>
                                </li>
                            ))
                        }
                        {
                            this.state.unsendMessages.map((data, index) => (
                                <li key={index} className='other'>
                                    <div className='msg grayBackground'>
                                        <p>{data.from}</p>
                                        <div className='message'>{data.message}</div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="chatInputWrapper">
                        <form onSubmit={this.handleSubmit} className="form">
                            <input
                                className="textarea input userName"
                                name="userName"
                                type="text"
                                value={this.props.userName}
                                placeholder="Nickname"
                                onChange={this.handleNickNameChange}
                            />
                            <input
                                className="textarea input"
                                name="messageText"
                                type="text"
                                value={this.state.messageText}
                                placeholder="Enter your message..."
                                onChange={this.handleMessageChange}
                            />
                            <button className="submitButton" type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </PageVisibility>
        )
    }
}
export default connect(mapStateToProps)(Chat);