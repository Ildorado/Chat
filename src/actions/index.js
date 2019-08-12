
export const addMessage = (payload) => {
    return {
        type: 'ADDMESSAGE',
        payload: payload
    }
}
export const addfirstMessage = (payload) => {
    return {
        type: 'ADDFIRSTMESSAGE',
        payload: payload
    }
}
export const setUserName = (payload) => {
    return {
        type: 'SETUSERNAME',
        payload: payload
    }
}
// export const setMessage = (payload) => {
//     return {
//         type: 'SETMESSAGE',
//         payload: payload
//     }
// }
