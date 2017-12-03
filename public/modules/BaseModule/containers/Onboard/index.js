import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

/** Components */
import Step1 from './step1';
import Step2 from './step2';

/** Styling */
import styles from './styles.css';

/** API, action creator functions */
import * as api from './api';
import * as userActions from '../../redux/userWidget';
import * as roomActions from '../../../RoomModule/redux/roomWidget';

const uuidV4 = require('uuid/v4');

class Onboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }


    createRoom(value) {
        const { firebase } = this.props;
        const { roomName } = this.state;
        const { firstName, lastName } = value;
        const userId = uuidV4();

        let name = roomName;
        if (!roomName) {
            name = 'New Conversation';
        }
        api.createRoom(firebase, { roomName: name, firstName, lastName, userId }).then((room) => {
            this.props.createRoom(room);
            this.props.createUser({
                firstName,
                lastName,
                userId
            });
            browserHistory.push('/createPoll');
        });
    }

    renderStep() {
        switch (this.state.step) {
            case 0: {
                return (
                    <Step1 
                        onClick={(value) => {
                            this.setState({ 
                                step: this.state.step + 1, 
                                roomName: value.roomName
                            });
                        }} 
                    />
                );
            }
            case 1: {
                return (
                    <Step2 
                        onClick={(value) => {
                            this.createRoom(value);
                        }}
                    />
                );
            }
            default:
                return <div />;
        }
    }

    render() {
        return (
            <div className={styles.onboard}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1 }}>
                        { this.renderStep() }
                    </div>
                    <div 
                        style={{ 
                            flex: 2, 
                            backgroundImage: "url('static/images/cloudy-day.png')" 
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default connect(null, { ...userActions, ...roomActions })(Onboard);
