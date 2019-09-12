import React from 'react';
import './Search.css';

const search = (props) => {
    return(
        <div className='SearchBox'>
            <input className='SearchBar' placeholder={props.placeHolder}/>
        </div>
    )
}

export default search;