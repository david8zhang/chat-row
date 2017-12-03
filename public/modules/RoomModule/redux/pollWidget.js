const CREATE_POLL = 'CREATE_POLL';
const ADD_POLL_ID_TO_ROOM = 'ADD_POLL_ID_TO_ROOM';
const UPDATE_TOPICS = 'UPDATE_TOPICS';

export const createPoll = (poll) => ({
    type: CREATE_POLL,
    payload: poll
});

export const addPollIdToRoom = (pollId) => ({
    type: ADD_POLL_ID_TO_ROOM,
    payload: pollId
});

export const updateTopics = (topics) => ({
    type: UPDATE_TOPICS,
    payload: topics
});

export default (state = null, action) => {
    switch (action.type) {
        case CREATE_POLL: {
            return action.payload;
        }
        case ADD_POLL_ID_TO_ROOM: {
            const newState = { ...state };
            newState.poll = action.payload;
            return newState;
        }
        case UPDATE_TOPICS: {
            const newState = { ...state };
            newState.topics = action.payload;
            return newState;
        }
        default:
            return state;
    }
};
