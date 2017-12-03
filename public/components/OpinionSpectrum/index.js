import React, { Component } from 'react';
import styles from './styles.css';

class OpinionSpectrum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			option: '',
			error: ''
		};
	}
	renderOptions() {
		const options = [
			'Strongly Disagree',
			'Disagree',
			'Neutral',
			'Agree',
			'Strongly Agree'
		];
		return options.map((option) => {
			let isSelected;
			if (option === this.state.option) {
				isSelected = styles.selected;
			}
			return (
				<div
					key={option}
					className={styles.option}
					onClick={() => this.setState({ option })}
				>
					<div className={`${styles.bubble} ${isSelected}`} />
					<p className={styles.optionText}>
						{ option }
					</p>
				</div>
			);
		});
	}
	render() {
		return (
			<div>
				<p style={{ color: 'red' }}>
					{ this.state.error }
				</p>
				<div className={styles.opinionSpectrum}>
					{ this.renderOptions() }
				</div>
				<button 
					className='button-primary'
					style={{ backgroundColor: '#2ECC71' }}
					onClick={() => {
						if (this.state.option) {
							this.props.onNext(this.state.option);
							this.setState({ option: '' });
						} else {
							this.setState({ error: 'No option entered! You must select an option!' });
						}
					}}
				>
					Next Question
				</button>
			</div>
		);
	}
}

export default OpinionSpectrum;
