/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

/** Actions & API functions */
import * as pollActions from '../../../RoomModule/redux/pollWidget';
import * as roomActions from '../../../RoomModule/redux/roomWidget';
import * as api from './api';
import styles from './styles.css';

const uuidV4 = require('uuid/v4');

class CreatePoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedTopic: '',
            topics: [{
                body: 'Hate speech should not be protected as free speech',
                responses: []
            }]
        };
    }

    deleteTopic(toDelete) {
        const newTopics = this.state.topics.filter((topic, index) => index !== toDelete);
        this.setState({ topics: newTopics });
    }

    addTopic() {
        const newTopics = this.state.topics.concat({
            body: this.state.editedTopic,
            responses: []
        });
        this.setState({
            topics: newTopics,
            editedTopic: ''
        });
    }

    createPoll() {
        const { roomId } = this.props.room;
        const { userId } = this.props.user;
        const pollId = uuidV4();
        const newPoll = {
            pollId,
            topics: this.state.topics
        };
        api.createPoll(this.props.firebase, newPoll, roomId).then(() => {
            this.props.createPoll(newPoll);
            this.props.addPollIdToRoom(pollId);
            browserHistory.push(`/room?roomId=${roomId}&userId=${userId}`);
        });
    }

    renderTopics() {
        return this.state.topics.map((topic, index) => {
            return (
                <p 
                    key={topic.body}
                    className={styles.topic}
                >
                    <b style={{ flex: 3 }}>
                        {`${index + 1}. ${topic.body}`}
                    </b>
                    <i
                        onClick={() => this.deleteTopic(index)}
                        className="fa fa-times-circle"
                        aria-hidden="true"
                        style={{
                            fontSize: '30px',
                            flex: 1,
                            color: 'red',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: '10px',
                            cursor: 'pointer'
                        }}
                    />
                </p>  
            );
        });
    }

    render() {
        return (
            <div 
                style={{
                    padding: '20px',
                    height: '100vh',
                    backgroundImage: "url('static/images/memphis-colorful.png')" 
                }}
            >
                <div className={styles.createPoll}>
                    <div className={styles.infoBlurb}>
                        <h1>Add some topics for discussion!</h1>
                        <p>
                            Add a few topics here that you think would be interesting to talk about.
                            We've auto-generated a few topics for you already
                        </p>
                    </div>
                    <div className={styles.topicList}>
                        { this.renderTopics() }
                    </div>
                    <div className={styles.newTopicForm}>
                        <input
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    this.addTopic();
                                }
                            }}
                            type='text'
                            style={{ width: '50%' }}
                            value={this.state.editedTopic}
                            onChange={(e) => this.setState({ editedTopic: e.target.value })}
                        />
                        <button
                            className='button-primary'
                            style={{ marginLeft: '10px' }}
                            onClick={() => this.addTopic()}
                        >
                            Add Topic
                        </button>
                    </div>
                </div>
                <button
                    className='button-primary'
                    style={{ 
                        display: 'block',
                        marginTop: '100px',
                        width: '120px',
                        color: 'white',
                        backgroundColor: '#2ECC71',
                        borderColor: '#2ECC71'
                    }}
                    onClick={() => this.createPoll()}
                >
                    Next
                    <i 
                        className="fa fa-arrow-right" aria-hidden="true"
                        style={{ marginLeft: '5px' }}
                    />
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    room: state.room,
    user: state.user
});

export default connect(mapStateToProps, { 
    ...pollActions,
    ...roomActions
})(CreatePoll);
