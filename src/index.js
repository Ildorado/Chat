import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const client = new WebSocket('ws://st-chat.shas.tel');


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
        };
    }
    handleSubmit() {
        console.log('submit message');
    }
    handleChange() {
        console.log('change message');
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
                </ul>
                <div className="chatInputWrapper">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            className="textarea input"
                            type="text"
                            placeholder="Nickname"
                            onChange={this.handleChange}
                        />
                        <input
                            className="textarea input"
                            type="text"
                            placeholder="Enter your message..."
                            onChange={this.handleChange}
                        />
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
