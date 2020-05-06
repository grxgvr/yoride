import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./ProfilePage.css";
import Input from "../../Components/UI/Input/Input";
import Spinner from "../../Components/UI/Spinner/Spinner";
import { FaStar } from "react-icons/fa";
import firebase from "firebase/app";

class ProfilePage extends Component {
  state = {
    edit: false,
    user: null,
    editUser: null
  }
  componentDidMount = () => {
    this.setState({user: this.props.user})
  }
  changeInputHandler = (type, value) => {
    // console.log(type, value)
    let state = this.state;
    state.editUser[type] = value;
    this.setState(state);
  };
  edit = () => {
    console.log('edit')
    this.setState({edit: true, editUser: {...this.state.user}})
  }
  save = () => {
    if(this.state.editUser.phone.length !== 16){
      console.log('naaa')
    }
    else {
      console.log(this.props.uid)
      let ref = firebase.database().ref(`/users/${this.props.uid}`).set({
        ...this.state.editUser
      }).then(() => this.setState({user: {...this.state.editUser}, edit: false}))
    }
  }
  render() {
    console.log(this.state)
    let content, buttons
    if(!this.state.user){
      content = <Spinner />
    }
    else {
      if(this.state.edit){
        buttons = (
          <span>
            <button className="cardButton green" onClick={this.save}>
              Сохранить
            </button>
          </span>
        )
        content = (
          <div
            className="tripPage prof"
            onClick={e =>
              e.target.className === "tripPage prof" ? this.props.toggle() : null
          }> 
            <div className="card">
              <img src={this.state.editUser.photoURL} className="profPicBig" alt='profileImage'/>
              <h1>{this.state.editUser.name}</h1>
                URL фото: <Input
                  type="input"
                  placeholder="Фото"
                  defaultValue={this.state.editUser.photoURL}
                  changed={e => this.changeInputHandler("photoURL", e.target.value)}
                  validated />
                Номер: <Input
                  type="phone"
                  placeholder="Номер телефона"
                  value={this.state.editUser.phone}
                  changed={e => this.changeInputHandler("phone", e.target.value)}
                  validated />
                Машина: <Input
                  type="input"
                  placeholder="Автомобиль"
                  defaultValue={this.state.editUser.auto}
                  changed={e => this.changeInputHandler("auto", e.target.value)}
                  validated />
                О себе: <Input
                  type="textarea"
                  placeholder="О себе"
                  defaultValue={this.state.editUser.about}
                  changed={e => this.changeInputHandler("about", e.target.value)}
                  validated />
              {buttons}
            </div>
          </div>
        )
      } else {
          buttons = this.props.isUser ? 
          (
            <span>
              <button className="cardButton green" onClick={this.edit}>
                Редактировать
              </button>
              <button className="cardButton exit" onClick={this.props.logout}>
                Выйти
              </button>
            </span>
          ) : <br/>
          content = (
            <div
              className="tripPage prof"
              onClick={e =>
              e.target.className === "tripPage prof" ? this.props.toggle() : null
            }>
              <div className="card">
                <img src={this.state.user.photoURL} className="profPicBig" alt='profileImage'/>
                <h1>{this.state.user.name}</h1>
              <span className="icon">
                <FaStar className='starIcon' /> 2/5
              </span>
                <p className="title">{this.state.user.phone}</p>
                <p><b>Машина</b>: {this.state.user.auto}</p>
                <p className='about'><b>О себе</b>: {this.state.user.about}</p>
                  {buttons}
              </div>
            </div>
          );
      }
    }
    return <div>{content}</div>;
  }
}

export default withRouter(ProfilePage);
