import React from "react";
import {IMaskInput} from 'react-imask';
import './Input.css';

const input = (props) => {
    let inputEl, classes;
    if(props.validated || props.validated===null)
      classes='SearchBar'
    else
      classes='SearchBar red'
    switch (props.type) {
        case "input":
          inputEl = <input className={classes} value={props.value} onChange={props.changed} placeholder={props.placeholder} defaultValue={props.defaultValue}/>;
          break;
        case "password":
          inputEl = <input type="password" className={classes} value={props.value} onChange={props.changed} placeholder={props.placeholder}/>;
          break;
        case "date":
          let today = new Date().toISOString().split('T')[0];
          inputEl = <input type="date" min={today} id = 'date' className={classes} defaultValue={today} placeholder={props.placeholder}/>
          break;
        case "textarea":
          inputEl = <textarea rows='2' className = 'textArea' placeholder={props.placeholder} onChange={props.changed} defaultValue={props.defaultValue}/>;
          break;
        case "time":
          inputEl = <input type="time" className={classes} value={props.value} onChange={props.changed} placeholder={props.placeholder}/>;
          break;
        case "phone":
          inputEl = <IMaskInput mask='+{7}-000-000-00-00' className={classes} onChange={props.changed} placeholder={props.placeholder} defaultValue={props.value}/>;
          break;
        case "number":
          inputEl = <IMaskInput mask={Number} min={0} className={classes} onChange={props.changed} placeholder={props.placeholder}/>;
          break;
        default:
          break;
    }
    return (
      <div className='SearchBox'>
        {inputEl}
      </div>
    );
}

export default input;