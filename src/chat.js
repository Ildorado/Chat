/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';
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
        this.chatMessageRef = React.createRef();
        this.state = {
            isVisible: true,
            isNotified: false
        };
    }
    componentDidMount() {
        this.props.dispatch(setUserName(localStorage.getItem('userName')));
        this.connecting();
    }

    connecting() {
        this.client = new WebSocket('ws://st-chat.shas.tel');
        this.isFirstMessage = true;
        this.client.onopen = () => {
            if (this.reconnectingInterval != null) {
                console.log('WebSocket Client Reconnected');
                clearInterval(this.reconnectingInterval);
                this.reconnectingInterval = null;
            }
            else {
                console.log('WebSocket Client Connected');
            }
            // setTimeout(() => this.client.close(), 10000)
        };
        this.client.onmessage = (message) => {
            if (this.state.isVisible === false && this.state.isNotified === false) {
                this.setState({
                    isNotified: true
                })
                this.notifyMe();
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
        // this.chatRef.current.scrollTop = this.chatRef.current.scrollHeight;
        this.chatRef.current.scrollTo({
            top: this.chatRef.current.scrollHeight,
            behavior: 'auto'
        })
    };
    handleSubmit = event => {
        console.log('submit message');
        event.preventDefault();
        this.client.send(JSON.stringify({
            from: this.props.userName,
            message: this.chatMessageRef.current.value
        }))
        localStorage.setItem('userName', this.props.userName);
        this.chatMessageRef.current.value = '';
    }
    // handleMessageChange() {
    //     console.log('' + this.chatMessageRef.current.value);
    //     this.props.dispatch(setMessage('' + this.chatMessageRef.current.value));
    // }
    handleNickNameChange = event => {
        this.setState({
            userName: event.target.value
        });
        this.props.dispatch(setUserName(event.target.value));

    }
    handleVisibilityChange = isVisible => {
        console.log('Visiblity status: ', isVisible);
        this.setState({
            isVisible: isVisible
        })
        if (isVisible === false) {
            this.setState({
                isNotified: false
            })
        }
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
                    <ul className="chat" id="chatList" ref={this.chatRef}>
                        {
                            this.props.groupMessage.map(data => (
                                <li key={data.id} className='other'>
                                    <div className='msg'>
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
                                ref={this.chatMessageRef}
                                placeholder="Enter your message..."
                            // onChange={this.handleMessageChange}
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