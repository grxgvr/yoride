import React from 'react';
import './ResultElement.css';
import { FaArrowRight } from 'react-icons/fa'

const resultElement = (props) => (
    <div className='ResultElement'>
    <div>
        <p>{props.element.date}</p>
        <h3>
            {props.element.from}
            <span className='icon'><FaArrowRight /></span>
            {props.element.to}
        </h3>
        <p>{props.element.departTime}<span className='delimeter'></span>{props.element.arrivalTime}</p>
        {props.element.alsoTo ? <p>Проездом: {props.element.alsoTo}</p>: null}
        <div className='bottomInfo'>
            <span><img src={props.element.driverPic} className='profPic' alt='profileImg'></img>{props.element.driverName}</span>
            <span className='price'>{parseInt(props.element.price)} р.</span>
        </div>
        <div className='bottomInfo'>
            <span>Авто: {props.element.driverAuto}</span>
            <span>Свободные места: {props.element.seatsRemain}</span>
        </div>
        <a onClick={() => props.toggle(props.element.id)}>Подробнее</a>
    </div>
    </div>
)

export default resultElement;