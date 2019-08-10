import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let client = new WebSocket('ws://st-chat.shas.tel');


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: null,
            userName: null,
            groupMessage: [],

        };
    }
    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
            this.setState({
                groupMessage: this.state.groupMessage.concat(JSON.parse(message.data))
            })
        };
        client.onclose = (e) => {
            client = new WebSocket('ws://st-chat.shas.tel');
            console.log('WebSocket Client Closed');
            console.log('Error:',e);
        }
        client.onerror = (event) =>     {
            console.log(event);
        }
    }

    handleSubmit = event => {
        console.log('submit message');
        event.preventDefault();
        client.send(JSON.stringify({
            from: this.state.userName,
            message: this.state.messageText
        }))
        event.target.reset();
    }
    handleMessageChange = event => {
        this.setState({
            messageText: event.target.value
        });
    }
    handleNickNameChange = event => {
        this.setState({
            userName: event.target.value
        });
    }
    render() {
        return (
            <div className="chatWindow">
                <ul className="chat" id="chatList">
                    <li className='self'>
                        <div className="msg">
                            <p>Me</p>
                            <div className='message'>Hello Lex!How are you?</div>
                        </div>
                    </li>
                    <li className='other'>
                        <div className="msg">
                            <p>Lex</p>
                            <div className='message'>Hello Ilya! I'm fine, how are you?</div>
                        </div>
                    </li>
                    {
                        this.state.groupMessage.map(data => (
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
                            className="textarea input"
                            name="userName"
                            type="text"
                            placeholder="Nickname"
                            onChange={this.handleNickNameChange}
                        />
                        <input
                            className="textarea input"
                            name="messageText"
                            type="text"
                            placeholder="Enter your message..."
                            onChange={this.handleMessageChange}
                        />
                        <button className="submitButton" type="submit">Send</button>
                    </form>
                </div>
            </div>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
