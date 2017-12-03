import { combineReducers } from 'redux';

import userReducer from './userWidget';
import roomReducer from '../../RoomModule/redux/roomWidget';
import pollReducer from '../../RoomModule/redux/pollWidget';
import convoReducer from '../../RoomModule/redux/convoWidget';

export default combineReducers({
    user: userReducer,
    room: roomReducer,
    poll: pollReducer,
    conversation: convoReducer
});
