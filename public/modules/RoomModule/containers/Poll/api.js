export const addResponse = (firebase, params) => {
    const { response, pollId, topicIndex } = params;
    const pollRef = firebase.database().ref(`polls/${pollId}`);
    return pollRef.once('value').then((res) => {
        const poll = res.val();
        const topics = poll.topics.map((topic, index) => {
            if (index === topicIndex) {
                const newTopic = { ...topic };
                if (!topic.responses) {
                    newTopic.responses = [response];
                } else {
                    newTopic.responses = topic.responses.concat(response);
                }
                return newTopic;
            }
            return topic;
        });
        poll.topics = topics;
        return pollRef.update({
            topics
        }).then(() => topics);
    });
};


export const updatePollResults = (firebase, pollId, updatePoll) => {
    const pollRef = firebase.database().ref(`polls/${pollId}`);
    pollRef.on('value', (res) => {
        updatePoll(res.val());
    });
};

const findDuplicate = (conversations, conversation) => {
    let duplicate = null;
    const sameTopicConvos = conversations.filter((convo) => convo.topic === conversation.topic);
    if (sameTopicConvos.length === 0) {
        return duplicate;
    }
    sameTopicConvos.forEach((convo) => {
        const userNames = convo.users.map((user) => `${user.firstName} ${user.lastName}`);
        console.log('existing names', userNames);

        const toCompareUsers = conversation.users;
        const noDuplicates = toCompareUsers.filter((user) => (
            userNames.indexOf(`${user.firstName} ${user.lastName}`) === -1
        ));
        console.log('No duplicates', noDuplicates);

        if (noDuplicates.length === 0) {
            duplicate = convo;
        }
    });
    return duplicate;
};

export const createConversation = (firebase, conversation) => {
    const convoRef = firebase.database().ref('conversations');
    return convoRef.once('value').then((res) => {
        console.log(res.val());
        if (!res.val()) {
            return convoRef.child(conversation.convoId).update({
                ...conversation
            }).then(() => conversation);
        }
        const conversations = Object.keys(res.val()).map((key) => res.val()[key]);
        console.log('Conversations', conversations);

        const duplicate = findDuplicate(conversations, conversation);
        if (duplicate) {
            return duplicate;
        }
        return convoRef.child(conversation.convoId).update({
            ...conversation
        }).then(() => conversation);
    });
};

export const addConversationToUser = (firebase, conversation, userId) => {
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.once('value').then((res) => {
        const user = res.val();
        if (user.conversations) {
            if (findDuplicate(user.conversations, conversation)) {
                return false;
            }
            return userRef.update({
                conversations: user.conversations.concat(conversation)
            });
        }
        return userRef.update({
            conversations: [conversation]
        });
    });
};


export const updateUserPoll = (firebase, { pollStatus, userId }) => {
    console.log('UserId', userId);
    const userRef = firebase.database().ref(`users/${userId}`);
    return userRef.update({
        finishedPoll: pollStatus
    });
};

export const listenToUser = (firebase, userId, updateUser) => {
    const userRef = firebase.database().ref(`users/${userId}`);
    userRef.on('value', (res) => {
        updateUser(res.val());
    });
};
