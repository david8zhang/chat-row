import React, { Component } from 'react';
import styles from './styles.css';

class Step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: ''
        };
    }
    
    render() {
        return (
            <div className={styles.step1}>
                <h1>What's the name of your conversation? (optional)</h1>
                <p>What are you going to be talking about?</p>
                <input
                    onKeyDown={(e) => {
						if (e.keyCode === 13) {
							this.props.onClick(this.state);
						}
					}}
                    placeholder='New Conversation'
                    style={{ width: '250px' }}
                    type='text' 
                    value={this.state.roomName} 
                    onChange={(e) => this.setState({ roomName: e.target.value })}
                />
                <button
                    className='button-primary'
                    style={{ 
                        display: 'block',
                        marginTop: '100px',
                        color: 'white',
                        backgroundColor: '#2ECC71',
                        borderColor: '#2ECC71'
                    }}
                    onClick={() => this.props.onClick(this.state)}
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

export default Step1;
