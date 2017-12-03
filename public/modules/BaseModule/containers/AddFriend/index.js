import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as api from './api';
import styles from './styles.css';

import * as userActions from '../../redux/userWidget';

const uuidV4 = require('uuid/v4');

class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            error: ''
        };
    }

    submit() {
        const { roomId } = this.props.location.query;
        const { firstName, lastName } = this.state;
        const userId = uuidV4();
        const user = { firstName, lastName, userId };

        const params = { firstName, lastName, roomId };
        api.addUserToRoom(this.props.firebase, params).then((valid) => {
            if (!valid) {
                this.setState({ error: 'That name has already been taken!' });
            } else {
                api.createUser(this.props.firebase, user).then(() => {
                    browserHistory.push(`/room?roomId=${roomId}&userId=${userId}`);
                    this.props.createUser(user);
                });
            }
        });
    }
    
    render() {
        let color = 'white';
        let background = '#ccc';
        if (this.state.firstName && this.state.lastName) {
            color = 'white';
            background = '#2ECC71';
        }
        return (
            <div className={styles.addFriendWrapper}>
                <div className={styles.addFriend}>
                    <h1>What's your name?</h1>
                    <p>Anonymity breeds trolling. It's good to talk on a first name basis!</p>
                    <input
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.submit();
                            }
                        }}
                        placeholder='First Name'
                        style={{ width: '250px', display: 'block' }}
                        type='text' 
                        value={this.state.firstName} 
                        onChange={(e) => this.setState({ firstName: e.target.value })}
                    />
                    <input
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.submit();
                            }
                        }}
                        placeholder='Last Name'
                        style={{ width: '250px', marginTop: '10px', display: 'block' }}
                        type='text'
                        value={this.state.lastName} 
                        onChange={(e) => this.setState({ lastName: e.target.value })}
                    />
                    <p style={{ color: '#F7CA18' }}>
                        { this.state.error }
                    </p>
                    <button
                        className='button-primary'
                        style={{ 
                            display: 'block',
                            marginTop: '100px',
                            color,
                            backgroundColor: background,
                            borderColor: background
                        }}
                        onClick={() => this.submit()}
                    >
                        Next
                        <i 
                            className="fa fa-arrow-right" aria-hidden="true"
                            style={{ marginLeft: '5px' }}
                        />
                    </button>
                </div>
                <div 
                    className={styles.image} 
                    style={{ backgroundImage: "url('static/images/congruent_pentagon.png')" }}
                />
            </div>
        );
    }
}

export default connect(null, { ...userActions })(AddFriend);
