
const userNameReducer = (state = '', action) => {
    switch (action.type) {
        case 'SETUSERNAME':
            return action.payload
        default:
            return state
    }
}
export default userNameReducer; 