import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OpinionSpectrum } from '../../../../components';
import * as pollActions from '../../redux/pollWidget';
import * as userActions from '../../../BaseModule/redux/userWidget';
import * as convoActions from '../../redux/convoWidget';
import * as api from './api';
import styles from './styles.css';

const uuidV4 = require('uuid/v4');

class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            results: this.props.user.finishedPoll
        };
    }

    componentDidMount() {
        const { pollId } = this.props.poll;
        const { userId } = this.props.user;
        const updatePoll = (poll) => {
            this.props.createPoll(poll);
        };
        const updateUser = (user) => {
            this.props.createUser(user);
        };
        api.updatePollResults(this.props.firebase, pollId, updatePoll);
        api.listenToUser(this.props.firebase, userId, updateUser);
    }

    addResponse(option, topicIndex) {
        const response = {
            option,
            user: this.props.user
        };
        const { pollId } = this.props.poll;
        const { userId } = this.props.user;
        const params = { pollId, response, topicIndex };
        api.addResponse(this.props.firebase, params).then((topics) => {
            this.props.updateTopics(topics);

            /** Set the status of the poll to finished, to go directly to the results */
            if (this.state.index === this.props.poll.topics.length - 1) {
                const pollStatusParams = {
                    pollStatus: true,
                    userId
                };
                api.updateUserPoll(this.props.firebase, pollStatusParams).then(() => {
                    this.props.updateUserPoll(true);
                    this.setState({ results: true });                    
                });
            } else {
                this.setState({ index: this.state.index + 1 });
            }
        });
    }

    createConversation({ topicBody, otherUser }) {
        const convoId = uuidV4();
        const { userId } = this.props.user;
        const params = {
            convoId,
            topic: topicBody,
            users: [otherUser, this.props.user],
        };
        api.createConversation(this.props.firebase, params).then((conversation) => {
            this.props.createConversation(conversation);

            api.addConversationToUser(this.props.firebase, conversation, userId).then((isNew) => {
                if (isNew) {
                    this.props.addConversationToUser(conversation);                    
                }
                this.props.startConversation(conversation.convoId);                
            });
        });
    }

    renderDisagreeResults(responses, topic) {
        const optionValues = {
            'Strongly Disagree': 0,
            Disagree: 1,
            Neutral: 2,
            Agree: 3,
            'Strongly Agree': 4
        };
        const userResponse = responses.filter((response) => (
            response.user.userId === this.props.user.userId
        ))[0];
        const userValue = optionValues[userResponse.option];
        const diffResponses = responses.filter((response) => {
            const diff = Math.abs(optionValues[response.option] - userValue);
            return (
                response.user.userId !== this.props.user.userId &&
                diff >= 2
            );
        });
        return diffResponses.map((diffResponse, index) => {
            const { user, option } = diffResponse;
            return (
                <div 
                    className={styles.diffResponse}
                    key={`${index} diffResponse`}
                >
                    <p style={{ fontSize: '15px', margin: '0px', flex: '1' }}>
                        <b>
                            {`${user.firstName} ${user.lastName}`}
                        </b>
                    </p>
                    <p style={{ margin: '0px', flex: '1' }}>
                        {option}
                    </p>
                    <button 
                        style={{ flex: '2' }}
                        className='button-primary'
                        onClick={() => {
                            const params = {
                                topicBody: topic.body,
                                otherUser: user
                            };
                            this.createConversation(params);
                        }}
                    >
                        Start a Conversation
                    </button>
                </div>
            );
        });
    }

    renderResults() {
        const { topics } = this.props.poll;
        return (
            <div 
                style={{ 
                    height: '100vh', 
                    overflowY: 'scroll', 
                    whiteSpace: 'nowrap'
                }}
            >
                <h1 style={{ padding: '20px', margin: '0px' }}>
                    Poll Results
                </h1>
                <hr 
                    style={{
                        margin: '0px', 
                        width: '100%', 
                        borderWidth: '2px', 
                        borderColor: '#aaa'
                    }}
                />
                {
                    topics.map((topic, index) => {
                        const { responses } = topic;
                        const userResponse = responses.filter((response) => (
                            response.user.userId === this.props.user.userId
                        ))[0];
                        return (
                            <div 
                                className={styles.topicResponse}
                                key={`${topic.body} ${index}`}
                            >
                                <h1 className={styles.topicResponseTitle}>
                                    {topic.body}
                                </h1>
                                <p className={styles.userOption}>
                                    Your Opinion: <b>{userResponse.option}</b>
                                </p>
                                { this.renderDisagreeResults(responses, topic) }
                                <hr 
                                    style={{ 
                                        margin: '25px 0px 0px 0px',
                                        width: '100%'
                                    }} 
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderTopics() {
        const selectedTopic = this.props.poll.topics[this.state.index];
        return (
            <div className={styles.topic}>
                <p className={styles.topicBody}>
                    {`${this.state.index + 1}. ${selectedTopic.body}`}
                </p>
                <OpinionSpectrum 
                    onNext={(option) => {
                        this.addResponse(option, this.state.index);
                    }} 
                />
            </div>
        );
    }

    render() {
        return (
            <div>
                { this.state.results && this.renderResults() }
                { !this.state.results && this.renderTopics() }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    poll: state.poll,
    user: state.user
});

const actions = {
    ...pollActions,
    ...userActions,
    ...convoActions
};

export default connect(mapStateToProps, actions)(Poll);
