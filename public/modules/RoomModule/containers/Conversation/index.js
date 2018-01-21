/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '../../../../components';
import * as api from './api';
import * as convoActions from '../../redux/convoWidget';
import styles from './styles.css';

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: this.props.conversation !== null
        };
    }

    componentDidMount() {
        if (!this.props.conversation) {
            api.fetchConversation(this.props.firebase, this.props.convoId).then((conversation) => {
                this.props.createConversation(conversation);
                this.setState({ loading: true });
            });
        }
        api.listenToConversation(this.props.firebase, this.props.convoId, (newConvo) => {
            console.log('MESSAGES', newConvo.messages);
            this.props.createConversation(newConvo);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.convoId !== this.props.convoId) {
            api.fetchConversation(this.props.firebase, nextProps.convoId).then((conversation) => {
                this.props.createConversation(conversation);
                this.setState({ loading: true });
            });
        }
    }

    addMessage() {
        const message = {
            body: this.state.chat,
            author: this.props.user
        };
        const { convoId } = this.props;
        api.addMessage(this.props.firebase, { chat: message, convoId }).then(() => {
            if (this.messages) {
                console.log(this.refs);
                this.messages.scrollTop = this.messages.scrollHeight + 1000;
            }
            this.setState({ chat: '' });
        });
    }

    renderMessages() {
        const { messages } = this.props.conversation;
        if (!messages) {
            return <div ref={(el) => { this.messages = el; }} />;
        }
        return (
            <div 
                className={styles.messages}
                ref={(el) => { this.messages = el; }}
            >
                {
                    messages.map((message) => {
                        const { firstName, lastName } = message.author;
                        return (
                            <div className={styles.message}>
                                <p style={{ marginRight: '5px', marginBottom: '0px' }}>
                                    <b>{`${firstName} ${lastName}`}:</b>
                                </p>
                                <p style={{ marginBottom: '0px' }}>
                                    {message.body}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        if (!this.state.loading) {
            return (
                <Loading />
            );
        }
        const { topic, users } = this.props.conversation;
        return (
            <div className={styles.chat}>
                <div className={styles.header}>
                    <h1 style={{ margin: '0px' }}>
                        {topic}
                    </h1>
                    <div className={styles.users}>
                        {
                            users.map((user) => {
                                return (
                                    <p className={styles.user}>
                                        {`${user.firstName} ${user.lastName}`}
                                    </p>
                                );
                            })
                        }
                    </div>
                </div>
                <hr style={{ margin: '0px' }} />
                { this.renderMessages() }
                <div className={styles.newChatInput}>
                    <input
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.addMessage();
                            }
                        }}
                        style={{ width: '100%', flex: '5' }}
                        type='text'
                        value={this.state.chat}
                        onChange={(e) => this.setState({ chat: e.target.value })}
                    />
                    <button 
                        className='button-primary'
                        onClick={() => this.addMessage()}
                        style={{ marginLeft: '10px' }}
                    >
                        send
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    conversation: state.conversation,
    user: state.user
});

export default connect(mapStateToProps, { ...convoActions })(Conversation);
