
const messageReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADDMESSAGE':
            return state.concat(action.payload)
        case 'ADDFIRSTMESSAGE': {
            return action.payload.reverse()
        }
        default:
            return state
    }
}
export default messageReducer; 