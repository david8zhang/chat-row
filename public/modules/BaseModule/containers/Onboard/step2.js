import React, { Component } from 'react';
import styles from './styles.css';

class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            error: ''
        };
    }

    submit() {
        if (this.state.firstName && this.state.lastName) {
            this.props.onClick(this.state);
        } else {
            this.setState({ error: 'You must enter a first and last name' });
        }
    }
    
    render() {
        let color = 'white';
        let background = '#ccc';
        if (this.state.firstName && this.state.lastName) {
            color = 'white';
            background = '#2ECC71';
        }
        return (
            <div className={styles.step1}>
                <h1>What's your name?</h1>
                <p>Anonymity breeds trolling. It's good to talk on a first name basis!</p>
                <input
                    autoFocus
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
        );
    }
}

export default Step2;
