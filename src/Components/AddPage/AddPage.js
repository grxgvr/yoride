import React, { Component } from "react";
import Input from "../../Components/UI/Input/Input";
import { withRouter } from 'react-router-dom';
import Button from "../../Components/UI/Button/Button";
import firebase from "firebase/app";
import './AddPage.css';
class AddPage extends Component {
  state = {
    isOk: true,
    wasError: false,
    from: {
      value: "",
      validated: null
    },
    to: {
      value: "",
      validated: null
    },
    alsoTo:{
      value: "",
    },
    price: {
      value: "",
      validated: null
    },
    departTime: {
      value: "",
      validated: null
    },
    arrivalTime: {
      value: "",
      validated: null
    },
    seats: {
      value: "",
      validated: null
    },
    comment: {
      value: ""
    },
    userId: null,
    user: null
  };
  componentDidMount =() => {
    if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;
      let user;
      let data = firebase.database().ref(`users/${userId}`);
      data.on("value", snap => {
        user = snap.val();
        this.setState({userId: userId, user})
      });
    } else this.props.history.push('/');
  }
  changeInputHandler = (type, value) => {
    let state = this.state;
    state[type].value = value;
    this.setState(state);
  };
  checkFields = () => {
    let state = this.state;
    state.isOk = true;
    state = this.checkField("from", state);
    state = this.checkField("to", state);
    state = this.checkField("departTime", state);
    state = this.checkField("arrivalTime", state);
    state = this.checkField("price", state);
    state = this.checkField("seats", state);
    state.wasError = state.isOk ? null : "Заполнены не все поля";
    this.setState(state);
    console.log(state)
    if (state.isOk) {
      firebase
        .database()
        .ref(`trips`)
        .push({
          from: state.from.value,
          to: state.to.value,
          alsoTo: state.alsoTo.value,
          date: document.getElementById('date').value,
          departTime: state.departTime.value,
          arrivalTime: state.arrivalTime.value,
          price: state.price.value,
          seatsRemain: state.seats.value,
          driver: state.userId,
          driverPic: state.user.photoURL,
          driverName: state.user.name,
          driverPhone: state.user.phone,
          driverAuto: state.user.auto,
          comment: state.comment.value,
          passengers: []
        }).then(this.props.history.push('/active'));
    }
  };
  checkField = (type, state) => {
    if (state[type].value === "") {
      state.isOk = false;
      state[type].validated = false;
    }
    return state;
  };
  render() {
    if(!this.props.isAuth) this.props.history.push('/');
    return (
      <div className="Homepage">
        <div className="menu">
          <h2>Предложить поездку</h2>
          <label>Откуда</label>
          <Input
            type="input"
            validated={this.state.from}
            changed={e => this.changeInputHandler("from", e.target.value)}
          />
          <label>Куда</label>
          <Input
            type="input"
            validated={this.state.to}
            changed={e => this.changeInputHandler("to", e.target.value)}
          />
          <label>Проездом*</label>
          <Input
            type="input"
            validated={this.state.to}
            changed={e => this.changeInputHandler("alsoTo", e.target.value)}
          />
          <label>Цена</label>
          <Input
            type="number"
            validated={this.state.price}
            changed={e => this.changeInputHandler("price", e.target.value)}
          />
          <label>Дата отбытия</label>
          <Input
            type="date"
            validated
          />
          <label>Время отбытия</label>
          <Input
            type="time"
            validated={this.state.departTime}
            changed={e => this.changeInputHandler("departTime", e.target.value)}
          />
          <label>Время прибытия</label>
          <Input
            type="time"
            validated={this.state.arrivalTime}
            changed={e =>
              this.changeInputHandler("arrivalTime", e.target.value)
            }
          />
          <label>Количество мест</label>
          <Input
            type="number"
            validated={this.state.arrivalTime}
            changed={e => this.changeInputHandler("seats", e.target.value)}
          />
          <label>Комментарий*</label>
          <Input
            type="textarea"
            validated
            changed={e => this.changeInputHandler("comment", e.target.value)}
          />
          <label>{this.state.wasError}</label>
          <br />
          <Button text="Предложить" click={this.checkFields} />
        </div>
      </div>
    );
  }
}

export default withRouter(AddPage);
