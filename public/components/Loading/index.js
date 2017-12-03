import React, { Component } from 'react';
import styles from './styles.css';

class Loading extends Component {
    render() {
        return (
            <div className={styles.loading}>
                <img 
                    src='http://www.freetoursbyfoot.com/wp-content/uploads/2017/05/loading.gif'
                    alt='none'
                />
                <p 
                    style={{ marginTop: '20px', fontSize: '35px', color: '#0094FF' }}
                >
                    Loading
                </p>
            </div>
        );
    }
}

export default Loading;
