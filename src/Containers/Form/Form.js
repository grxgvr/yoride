import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Button from "../../Components/UI/Button/Button";
import Input from "../../Components/UI/Input/Input";
import Spinner from "../../Components/UI/Spinner/Spinner";
import axios from "axios";
import firebase from "firebase/app";
import "./Form.css";

class Form extends Component {
  state = {
    formType: "login",
    load: false,
    wasError: false,
    user: {
      email: {
        value: "",
        validated: true
      },
      password: {
        value: "",
        validated: true
      },
      passwordRepeat: {
        value: "",
        validated: true
      },
      name: {
        value: "",
        validated: true
      },
      phone: {
        value: "",
        validated: true
      },
      auto: {
        value: ""
      },
      profPic: {
        value: ""
      }
    }
  };
  componentWillMount = () => {
    if(this.props.isAuth)
      this.props.history.push('/')
  }
  toggleRegisterForm = () => {
    this.setState({ formType: "register" });
  };
  registerHandler = () => {};
  loginHandler = () => {};
  checkFields = () => {
    let check = this.state.user;
    let ok = true;
    if (check.email.value === "" && check.email.value.indexOf("@") < 0) {
      ok = false;
      check.email.validated = false;
    }
    if (check.password.value === "") {
      ok = false;
      check.password.validated = false;
    }
    if (this.state.formType !== "login") {
      if (check.phone.value.length < 16) {
        ok = false;
        check.phone.validated = false;
      }
      if (check.passwordRepeat.value === "") {
        ok = false;
        check.passwordRepeat.validated = false;
      }
      if (check.name.value === "") {
        ok = false;
        check.name.validated = false;
      }
      if (check.password.value !== check.passwordRepeat.value) {
        ok = false;
        check.password.validated = false;
        check.passwordRepeat.validated = false;
      }
      if (check.profPic.value === ''){
        axios.get("https://randomuser.me/api/")
        .then(info => {
          check.profPic.value = info.data.results[0].picture.medium
        })
      }
    }
    if (ok) {
      this.setState({ load: true });
      if (this.state.formType !== "login") {
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            check.email.value,
            check.password.value
          )
          .then(res => {
            const uid = firebase.auth().currentUser.uid;
            console.log(check.profPic.value);
            firebase.database().ref(`/users/${uid}`).set({
              name: check.name.value,
              photoURL: check.profPic.value,
              auto: check.auto.value,
              phone: check.phone.value
            })
          })
          .then(this.setState({ load: false, wasError: null }))
          .then(this.props.history.push("/search"))
          .catch(err => {
            this.setState({ wasError: err.message, load: false });
          });
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(check.email.value, check.password.value)
          .then(res => {
            this.setState({ load: false, wasError: null });
            this.props.history.push("/search");
          })
          .catch(err => {
            this.setState({ wasError: err.message, load: false });
          });
      }
    } else {
      this.setState({ user: check });
    }
  };
  changeInputHandler = (type, value) => {
    let state = this.state;
    state.user[type].value = value;
    state.user[type].validated = true;
    this.setState(state);
  };
  render() {
    let fields;
    if (this.state.formType === "login")
      fields = (
        <div>
          <Input
            type="input"
            placeholder="Почта"
            validated={this.state.user.email.validated}
            changed={e => this.changeInputHandler("email", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            validated={this.state.user.password.validated}
            changed={e => this.changeInputHandler("password", e.target.value)}
          />
          <label>{this.state.wasError}</label>
          <button className="btn" onClick={this.checkFields}>
            Войти
          </button>
          <label onClick={this.toggleRegisterForm}>Регистрация</label>
        </div>
      );
    else
      fields = (
        <div>
          <Input
            type="input"
            placeholder="Почта"
            validated={this.state.user.email.validated}
            changed={e => this.changeInputHandler("email", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            validated={this.state.user.password.validated}
            changed={e => this.changeInputHandler("password", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Повторите пароль"
            validated={this.state.user.passwordRepeat.validated}
            changed={e =>
              this.changeInputHandler("passwordRepeat", e.target.value)
            }
          />
          <Input
            type="input"
            placeholder="ФИО"
            validated={this.state.user.name.validated}
            changed={e => this.changeInputHandler("name", e.target.value)}
          />
          <Input
            type="phone"
            placeholder="Номер телефона"
            validated={this.state.user.phone.validated}
            changed={e => this.changeInputHandler("phone", e.target.value)}
          />
          <Input
            type="input"
            placeholder="*Авто"
            validated
            changed={e => this.changeInputHandler("auto", e.target.value)}
          />
          <Input
            type="input"
            placeholder="*Фото профиля"
            validated
            changed={e => this.changeInputHandler("profPic", e.target.value)}
          />
          <label>{this.state.wasError}</label>
          <Button text="Регистрация" click={this.checkFields} />
        </div>
      );
    let loading = this.state.load ? <Spinner /> : null;
    return (
      <div className="Content">
        {fields}
        {loading}
      </div>
    );
  }
}
export default withRouter(Form);
