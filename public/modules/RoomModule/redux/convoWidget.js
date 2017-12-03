const CREATE_CONVERSATION = 'CREATE_CONVERSATION';

export const createConversation = (conversation) => ({
    type: CREATE_CONVERSATION,
    payload: conversation
});

export default (state = null, action) => {
    switch (action.type) {
        case CREATE_CONVERSATION: {
            return action.payload;
        }
        default:
            return state;
    }
};
