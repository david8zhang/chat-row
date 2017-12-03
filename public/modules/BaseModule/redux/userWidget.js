const CREATE_USER = 'CREATE_USER';
const UPDATE_USER_POLL = 'UPDATE_USER_POLL';
const ADD_CONVERSATION_TO_USER = 'ADD_CONVERSATION_TO_USER';

export const createUser = (user) => ({
    type: CREATE_USER,
    payload: user
});

export const updateUserPoll = (pollResult) => ({
    type: UPDATE_USER_POLL,
    payload: pollResult
});

export const addConversationToUser = (conversation) => ({
    type: ADD_CONVERSATION_TO_USER,
    payload: conversation
});

export default (state = null, action) => {
    switch (action.type) {
        case CREATE_USER: {
            return action.payload;
        }
        case UPDATE_USER_POLL: {
            const newState = { ...state };
            newState.finishedPoll = action.payload;
            return newState;
        }
        case ADD_CONVERSATION_TO_USER: {
            const newState = { ...state };
            if (newState.conversations) {
                newState.conversations = newState.conversations.concat(action.payload);
            } else {
                newState.conversations = [action.payload];
            }
            return newState;
        }
        default:
            return state;
    }
};
