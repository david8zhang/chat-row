/* eslint-disable arrow-body-style */
export const fetchRoom = (firebase, roomId, updateRoom) => {
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    return roomRef.on('value', (res) => {
        updateRoom(res.val());
    });
};


export const fetchUser = (firebase, userId) => {
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.once('value').then((res) => {
        return res.val();
    });
};


export const fetchPollByRoomId = (firebase, roomId) => {
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    return roomRef.once('value').then((res) => {
        const { poll } = res.val();
        const pollRef = firebase.database().ref(`polls/${poll}`);
        return pollRef.once('value').then((data) => {
            return data.val();
        });
    });
};
