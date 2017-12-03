/* eslint-disable arrow-body-style */
const uuidV4 = require('uuid/v4');

export const createRoom = (firebase, params) => {
    const roomId = uuidV4();
    const { firstName, lastName, roomName, userId } = params;
    const newRoom = {
        roomId,
        roomName,
        users: [{
            creator: true,
            userId,
            firstName,
            lastName
        }]
    };
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    const userRef = firebase.database().ref(`users/${userId}`);
    return roomRef.update({
        ...newRoom
    }).then(() => {
        return userRef.update({
            firstName,
            lastName,
            userId
        }).then(() => ({
            roomId,
            ...newRoom
        }));
    });
};

