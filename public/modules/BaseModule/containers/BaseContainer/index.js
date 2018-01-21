/** React & Redux */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

/** Firebase */
import firebase from 'firebase';

/** Containers & Components */
import Onboard from '../Onboard';
import AddFriend from '../AddFriend';
import CreatePoll from '../CreatePoll';
import { Room } from '../../../RoomModule/containers';
import { Button } from '../../../../components';

/** Styling */
import styles from './styles.css';

const fbConf = {
	apiKey: 'AIzaSyA13Gv0WRk-DR1V8AiEPC6bvBuWVoa2yrA',
    authDomain: 'chat-row.firebaseapp.com',
    databaseURL: 'https://chat-row.firebaseio.com',
    projectId: 'chat-row',
    storageBucket: 'chat-row.appspot.com',
    messagingSenderId: '91366957647'
};

firebase.initializeApp(fbConf);

class BaseContainer extends Component {
	renderContent() {
		const home = (
			<div
				style={{ 
					backgroundImage: "url('static/images/circles-dark.png')"
				}}
			>
				<div className={styles.home}>
					<img
						src='/static/images/logo2.png'
						alt='none'
						style={{ width: '200px', height: '200px' }}
					/>
					<h1 className={styles.title}>
						Chat Row
					</h1>
					<p className={styles.blurb}>
						Discuss anything you want with your friends. Learn something
						new from disagreements. Burst your social media bubble, using
						your social network.
					</p>
					<Button 
						onClick={() => browserHistory.push('/onboard')}
						text='Start a Conversation'
					/>
				</div>
			</div>
		);
		const route = this.props.location.pathname;
		if (route === '/') {
			return home;
		} else if (route.indexOf('/onboard') !== -1) {
			return (
				<Onboard 
					firebase={firebase}
				/>
			);
		} else if (route.indexOf('/room') !== -1) {
			return (
				<Room
					firebase={firebase} 
					location={this.props.location}				
				/>
			);
		} else if (route.indexOf('/friend') !== -1) {
			return (
				<AddFriend
					firebase={firebase}
					location={this.props.location}
				/>
			);
		} else if (route.indexOf('/createPoll') !== -1) {
			return (
				<CreatePoll
					firebase={firebase}
					location={this.props.location}
				/>
			);
		}
	}
	render() {
		return (
			<div className={styles.base}>
				{ this.renderContent() }
			</div>
		);
	}
}

export default BaseContainer;
