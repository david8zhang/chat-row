/* global window */

/** React & Redux configuration */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import styles from './styles.css';

/** Components */
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { Loading } from '../../../../components';
import Poll from '../Poll';
import Conversation from '../Conversation';

/** Action Creator & API Functions */
import * as api from './api';
import * as roomActions from '../../redux/roomWidget';
import * as userActions from '../../../BaseModule/redux/userWidget';
import * as pollActions from '../../redux/pollWidget';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        const { roomId, userId } = this.props.location.query;

        api.fetchUser(this.props.firebase, userId).then((user) => {
            this.props.createUser(user);

            api.fetchPollByRoomId(this.props.firebase, roomId).then((poll) => {
                this.props.createPoll(poll);
                /** Fetch the room */
                const updateRoom = (room) => {
                    this.props.createRoom(room);

                    /** Fetch the user */
                    if (!this.state.loaded) {
                        this.setState({ loaded: true });
                    }
                };
                api.fetchRoom(this.props.firebase, roomId, updateRoom);
            });
        });
    }

    renderMembers() {
        const { users } = this.props.room;
        return (
            <div className={styles.memberList}>
                <h1 className={styles.roomName}>
                    Members
                </h1>
                {
                    users.map((user) => (
                        <p key={user.userId} style={{ marginBottom: '5px' }}>
                            <i 
                                className="fa fa-user-o"
                                aria-hidden="true"
                                style={{ marginRight: '10px' }}
                            />
                            { `${user.firstName} ${user.lastName}` }
                        </p>
                    ))
                }
                <p 
                    className={styles.addUser}
                    onClick={() => this.setState({ showInvite: true })}
                >
                    <i 
                        className="fa fa-plus-square-o" 
                        aria-hidden="true" 
                        style={{ marginRight: '10px' }}
                    />
                    Add User
                </p>
            </div>
        );
    }

    renderConversations() {
        const { conversations } = this.props.user;
        const setConvoId = (convoId) => this.setState({
            convoId,
            window: 'conversation'
        });
        if (conversations) {
            return (
                <div className={styles.memberList}>
                    <h1 className={styles.roomName}>
                        Conversations
                    </h1>
                    {
                        conversations.map((conversation) => {
                            return (
                                <p 
                                    key={conversation.convoId} 
                                    style={{ marginBottom: '5px', cursor: 'pointer' }}
                                    onClick={() => setConvoId(conversation.convoId)}
                                >
                                    <i 
                                        className="fa fa-commenting-o"
                                        aria-hidden="true"
                                        style={{ marginRight: '10px' }}
                                    />
                                    { conversation.topic }
                                </p>
                            );
                        })
                    }
                </div>
            );
        }
    }

    renderSidebar() {
        const { roomName } = this.props.room;
        const { firstName, lastName } = this.props.user;

        return (
            <div className={styles.sidebar}>
                <i 
                    className='fa fa-angle-double-left'
                    style={{ 
                        marginBottom: '25px',
                        cursor: 'pointer',
                        fontSize: '25px'
                    }}
                    onClick={() => { browserHistory.push('/'); }}
                />
                <h1 
                    className={styles.roomName}
                    onClick={() => this.setState({ window: null })}
                >
                    { roomName }
                </h1>
                <p>
                    <i 
                        className="fa fa-user-o" aria-hidden="true"
                        style={{ marginRight: '10px' }}
                    />
                    { `${firstName} ${lastName}` }
                </p>
                { this.renderMembers() }
                { this.renderConversations() }
            </div>
        );
    }

    renderWindow() {
        const { roomName } = this.props.room;
        const { users } = this.props.room;
        const { finishedPoll } = this.props.user;
        let blurbTitle = 'Begin Poll';
        let blurbDesc = 'Learn what your friends think about the topics you provided!';
        let buttonTitle = 'Start Poll';
        if (finishedPoll) {
            blurbTitle = 'See Poll Results!';
            blurbDesc = 'Start new conversations with your friends that think differently than you do';
            buttonTitle = 'See Results';
        }
        let window = (
            <div className={styles.homePage}>
                <h1>{ blurbTitle }</h1>
                <p>{ blurbDesc }</p>
                <button 
                    className='button-primary'
                    style={{
                        color: 'white',
                        backgroundColor: '#2ECC71',
                        borderColor: '#2ECC71'
                    }}
                    onClick={() => this.setState({ window: 'poll' })}
                >
                    { buttonTitle }
                </button>
            </div>
        );

        let header = (
            <div>
                <div className={styles.header}>
                    <h1 style={{ marginBottom: '10px' }}>
                        Welcome to { roomName }!
                    </h1>
                    <p style={{ marginBottom: '20px' }}>
                        <i 
                            className="fa fa-user-o" aria-hidden="true"
                            style={{ marginRight: '5px' }}
                        />
                        {users.length} Member(s)
                    </p>
                </div>
                <hr style={{ width: '100%', margin: '0px' }} />
            </div>
        );
        if (this.state.window === 'poll') {
            header = <div />;
            window = (
                <Poll
                    location={this.props.location}
                    firebase={this.props.firebase}
                    startConversation={(convoId) => {
                        this.setState({ window: 'conversation', convoId });
                    }}
                />
            );
        } else if (this.state.window === 'conversation') {
            header = <div />;
            window = (
                <Conversation
                    convoId={this.state.convoId}
                    firebase={this.props.firebase}
                    location={this.props.location}
                />
            );
        }
        return (
            <div className={styles.window}>
                { header }
                { window }
            </div>
        );
    }

    renderInvite() {
        const { roomId } = this.props.location.query;
        if (!this.state.showInvite) {
            return <div />;
        }
        return (
            <ModalContainer onClose={() => this.setState({ showInvite: false })}>
                <ModalDialog onClose={() => this.setState({ showInvite: false })}>
                    <div className={styles.inviteFriend}>
                        <h1 style={{ marginBottom: '10px' }}>
                            Invite a friend
                        </h1>
                        <p style={{ marginBottom: '10px' }}>
                            Copy and paste this link to invite friends to join the room
                        </p>
                        <input
                            style={{ width: '100%' }}
                            value={`localhost:9000/friend?roomId=${roomId}`}
                            type='text' 
                            readOnly
                        />
                    </div>
                </ModalDialog>
            </ModalContainer>
        );
    }

    render() {
        return (
            <div>
                { this.renderInvite() }
                { !this.state.loaded && <Loading /> }
                {
                    this.state.loaded &&
                    <div className={styles.room}>
                        { this.renderSidebar() }
                        { this.renderWindow() }
                    </div>
                }
            </div>
        );
    }
}

export const mapStateToProps = (state) => ({
    room: state.room,
    user: state.user,
    poll: state.poll
});

const actions = {
    ...roomActions,
    ...userActions,
    ...pollActions
};

export default connect(mapStateToProps, actions)(Room);
