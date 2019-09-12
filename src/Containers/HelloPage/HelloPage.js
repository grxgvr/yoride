import React, { Component } from 'react';
import Landing from '../../Components/Landing/Landing'
import './HelloPage.css';

class Hello extends Component {
    state = {
        isFormToggled: false
    }

    render(){
        let linkTo = this.props.auth ? '/search' : '/login';
        let content = <Landing linkTo = {linkTo} />
        return (
                <div className='HelloBox'>
                    {content}
                </div>
        )
    }
}


export default Hello;