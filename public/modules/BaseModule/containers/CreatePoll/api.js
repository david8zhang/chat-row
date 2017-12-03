export const createPoll = (firebase, poll, roomId) => {
    const { pollId } = poll;
    const roomRef = firebase.database().ref(`rooms/${roomId}`);
    const pollRef = firebase.database().ref(`polls/${pollId}`);
    return pollRef.update({
        ...poll
    }).then(() => {
        return roomRef.update({
            poll: pollId
        });
    });
};
