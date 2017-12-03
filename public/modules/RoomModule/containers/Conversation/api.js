export const fetchConversation = (firebase, convoId) => {
    const convoRef = firebase.database().ref(`conversations/${convoId}`);
    return convoRef.once('value').then((res) => res.val());
};

export const addMessage = (firebase, { chat, convoId }) => {
    const convoRef = firebase.database().ref(`conversations/${convoId}`);
    return convoRef.once('value').then((res) => {
        const convo = res.val();
        let newMessages = convo.messages;
        if (!newMessages) {
            newMessages = [chat];
        } else {
            newMessages = newMessages.concat(chat);
        }
        return convoRef.update({
            messages: newMessages
        });
    });
};

export const listenToConversation = (firebase, convoId, updateConvo) => {
    const convoRef = firebase.database().ref(`conversations/${convoId}`);
    return convoRef.on('value', (res) => {
        updateConvo(res.val());
    });
};
