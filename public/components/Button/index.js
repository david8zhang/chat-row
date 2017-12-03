import React, { Component } from 'react';
import styles from './styles.css';

class Button extends Component {
    render() {
        return (
            <span
                style={this.props.style}
                className={styles.startButton}
                onClick={() => this.props.onClick()}
            >
                { this.props.text }
            </span>
        );
    }
}

export default Button;
