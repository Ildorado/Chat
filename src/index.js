import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import Chat from './chat'
// const mapStateToProps = state => {
//     return { counter: state.counter };
// }

// let store = createStore(
//     rootReducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

//STORE -> GLOBALIZED STATE

//ACTION

//REDUCER

//DISPATCH
// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             messageText: '',
//             userName: '',
//             groupMessage: [],

//         };
//         this.reconnectingInterval = null;
//         this.chatRef = React.createRef();
//     }
//     componentDidMount() {
//         this.setState({
//             userName: localStorage.getItem('userName')
//         })
//         // let asd = setInterval(() => useDispatch(increment()), 1000);
//         console.log('local Storage userName get ', localStorage.getItem('userName'));
//         this.connecting();
//     }

//     connecting() {
//         this.client = new WebSocket('ws://st-chat.shas.tel');
//         let isFirstMessage = true;
//         this.client.onopen = () => {
//             if (this.reconnectingInterval != null) {
//                 console.log('WebSocket Client Reconnected');
//                 clearInterval(this.reconnectingInterval);
//                 this.reconnectingInterval = null;
//             }
//             else {
//                 console.log('WebSocket Client Connected');
//             }
//             // setTimeout(() => this.client.close(), 10000)
//         };
//         this.client.onmessage = (message) => {
//             console.log(message);
//             if (isFirstMessage) {
//                 this.setState({
//                     groupMessage: JSON.parse(message.data)
//                 })
//                 isFirstMessage = false;
//                 this.scrollToBottom();
//             }
//             else {
//                 this.setState({
//                     groupMessage: this.state.groupMessage.concat(JSON.parse(message.data))
//                 })
//             }
//         };
//         this.client.onclose = () => {
//             console.log('WebSocket Client Closed');
//             // setTimeout(function(){
//             //     client = new WebSocket('ws://st-chat.shas.tel'); 
//             // },1000);
//             this.reconnectingInterval = setInterval(() => {
//                 console.log('trying to reconnect');
//                 this.connecting();
//             }, 2000)
//         }
//         // this.reconnectingInterval = setInterval(function () {
//         //     client = new WebSocket('ws://st-chat.shas.tel');
//         //     console.log('trying to reconnect');
//         // }, 2000)

//     }
//     scrollToBottom = () => {
//         // this.chatRef.current.scrollTop = this.chatRef.current.scrollHeight;
//         this.chatRef.current.scrollTo({
//             top: this.chatRef.current.scrollHeight,
//             behavior: 'auto'
//         })
//     };
//     handleSubmit = event => {
//         console.log('submit message');
//         event.preventDefault();
//         this.client.send(JSON.stringify({
//             from: this.state.userName,
//             message: this.state.messageText
//         }))
//         localStorage.setItem('userName', this.state.userName);
//         this.setState({
//             messageText: ''
//         })
//     }
//     handleMessageChange = event => {
//         this.setState({
//             messageText: event.target.value
//         });
//     }
//     handleNickNameChange = event => {
//         this.setState({
//             userName: event.target.value
//         });
//     }
//     render() {
//         return (
//             <div className="chatWindow">
//                 <ul className="chat" id="chatList" ref={this.chatRef}>
//                     {/* <li className='self'>
//                         <div className="msg">
//                             <p>Me</p>
//                             <div className='message'>Hello Lex!How are you?</div>
//                         </div>
//                     </li>
//                     <li className='other'>
//                         <div className="msg">
//                             <p>Lex</p>
//                             <div className='message'>Hello Ilya! I'm fine, how are you?</div>
//                         </div>
//                     </li> */}
//                     {
//                         this.state.groupMessage.map(data => (
//                             <li key={data.id} className='other'>
//                                 <div className='msg'>
//                                     <p>{data.from}</p>
//                                     <div className='message'>{data.message}</div>
//                                 </div>
//                             </li>
//                         ))
//                     }
//                 </ul>
//                 <div className="chatInputWrapper">
//                     <form onSubmit={this.handleSubmit} className="form">
//                         <input
//                             className="textarea input userName"
//                             name="userName"
//                             type="text"
//                             value={this.state.userName}
//                             placeholder="Nickname"
//                             onChange={this.handleNickNameChange}
//                         />
//                         <input
//                             className="textarea input"
//                             name="messageText"
//                             type="text"
//                             value={this.state.messageText}
//                             placeholder="Enter your message..."
//                             onChange={this.handleMessageChange}
//                         />
//                         <button className="submitButton" type="submit">Send</button>
//                     </form>
//                 </div>
//             </div>

//         )
//     }
// }
const App = () => (
    <Provider store={store}>
        <Chat />
    </Provider>
)
ReactDOM.render(
    <App />,
    document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
