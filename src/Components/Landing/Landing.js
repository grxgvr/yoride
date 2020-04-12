import React from 'react';
import Button from '../UI/Button/Button';
import './Landing.css'
import { NavLink } from 'react-router-dom'

const landing = (props) => (
    <div className='Content'>
        <h1>Поехали!</h1>
        <hr/>
        <p>Попутчик! - это сервис для поиска попутчиков</p>
        <p>Находите нужную вам поездку или публикуйте свою</p>
        <p>Вместе выгоднее!</p>
        <NavLink to={props.linkTo}>
            <Button text='Начать!'/>
        </NavLink>
    </div>
)

export default landing;