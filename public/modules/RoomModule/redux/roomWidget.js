const CREATE_ROOM = 'CREATE_ROOM';

export const createRoom = (room) => ({
    type: CREATE_ROOM,
    payload: room
});

export default (state = null, action) => {
    switch (action.type) {
        case CREATE_ROOM: {
            return action.payload;
        }
        default:
            return state;
    }
};
