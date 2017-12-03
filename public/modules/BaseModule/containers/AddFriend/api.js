const uuidV4 = require('uuid/v4');

export const addUserToRoom = (firebase, params) => {
    const { roomId, firstName, lastName } = params;
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    return roomRef.once('value').then((res) => {
        const { users } = res.val();
        const duplicateNames = users.filter((user) => (
            user.firstName === firstName && user.lastName === lastName
        ));
        if (duplicateNames.length > 0) {
            return false;
        }        
        const userId = uuidV4();
        const newUsers = users.concat({ firstName, lastName, userId });
        return roomRef.update({
            users: newUsers
        }).then(() => true);
    });
};


export const createUser = (firebase, user) => {
    const { userId } = user;
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.update({
        ...user
    });
};
