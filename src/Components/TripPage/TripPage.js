import React, { Component } from "react";
import { FaArrowRight, FaUser } from "react-icons/fa";
import Input from '../UI/Input/Input';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import firebase from "firebase/app";
import ProfilePage from "../../Containers/ProfilePage/ProfilePage";
import "./TripPage.css";

class TripPage extends Component {
  state = {
    isEdit: false,
    open: false,
    user: null,
    cargo: false,
    rvwToggle: false,
    rate: 0,
    allowToRev: false
  };
  componentDidMount = () => {
    if(this.props.intention == 'history'){
      let db = firebase.database()
      let revRef = db.ref(`/users/${this.props.element.driver.id}/reviews/${this.props.uid}`);
      revRef.once("value", snap => {
        let rev = snap.val();
        this.setState({
          isEdit: false,
          open: false,
          user: null,
          cargo: false,
          rvwToggle: false,
          rate: 0,
          allowToRev: rev === null
        })
      })
    } else {
      this.setState({
        isEdit: false,
        open: false,
        user: null,
        cargo: false,
        rvwToggle: false
      })
    }
  }
  toggleProfPage = (user) => {
    if (this.state.open) {
      this.setState({ open: false, user: null });
    } else {
      this.setState({ open: true, user });
    }
  };
  toggleCargo = () => {
    if (this.state.cargo) {
      this.setState({ cargo: false});
    } else {
      this.setState({ cargo: true});
    }
  }
  toggleReview = () => {
    if (this.state.rvwToggle) {
      this.setState({ rvwToggle: false});
    } else {
      this.setState({ rvwToggle: true});
    }
  }
  onRate = (e) => {
    this.setState({rate: e.rating})
  }
  sendReview = () => {
    let review = document.getElementById('otziv').value;
    let db = firebase.database()
    let driverRef = db.ref(`/users/${this.props.element.driver.id}`)
    driverRef.once("value", snap => {
      let user = snap.val();
      if(user.rateSum){
        let rateSum = user.rateSum + this.state.rate, rateCount = user.rateCount + 1;
        user = {
          ...user,
          rate: rateSum / rateCount,
          rateSum,
          rateCount,
          reviews: { ...user.reviews, [this.props.uid]: {rate: this.state.rate, review}}
        }
      } else {
        user = {
          ...user,
          rate: this.state.rate,
          rateSum: this.state.rate,
          rateCount: 1,
          reviews: { [this.props.uid]: {rate: this.state.rate, review}}
        }
      }
      // console.log(user)
      driverRef.set(user);
    })
    .then(this.props.toggle())
  }
  render() {
    let button, passengers, label
    let page =
      this.state.open ? (
        <ProfilePage
          user={this.state.user}
          toggle={this.toggleProfPage}
          isUser={false}
        />
      ) : null;
    let cargo = this.state.cargo ? (
        <div>Свяжитесь с водителем для обговора деталей</div>
    ) : null
    if (this.props.element.driver === this.props.uid){
      button = (
        <button
          onClick={() => {
            this.props.toggle();
            this.props.delete(this.props.element.id);
          }}
          className="cardButton exit rounded"
        >
          Удалить
        </button>
      );
    }
    else if (this.props.tripsIds.indexOf(this.props.element.id) < 0){
      button = (
        <button onClick={this.props.book} className="cardButton green rounded">
          Забронировать
        </button>
      );
      label = <label className='gruz' onClick={this.toggleCargo}>Мне нужно перевезти груз</label>
    }
    else if(this.props.intention == 'history'){
      if(this.state.rvwToggle && this.state.allowToRev){
        label = (
          <span>
            <Rater id='rate' total={5} rating={this.state.rate} onRate={(e) => this.onRate(e)}/>
            <Input
            type="textarea"
            id='otziv'
            placeholder="Расскажите о своих впечатлениях"/>
          </span>
        )
        button = <button
          onClick={this.sendReview}
          className="cardButton green rounded">
          Оставить отзыв
        </button>
      } else if(this.state.allowToRev)
      label = <label className='gruz' onClick={this.toggleReview}>Оставить отзыв</label>
    }
    else {
      button = (
        <button
          onClick={() => {
            this.props.toggle();
            this.props.cancelBook(this.props.element.id);
          }}
          className="cardButton exit rounded"
        >
          Отменить бронирование
        </button>
      );
    }
    passengers = this.props.element.passengers ? (
      <div className="passengers">
        <p>Пассажиры</p>
        {this.props.element.passengers.map(el => 
        { let img = el.photoURL ? <img src={el.photoURL} className="profPicSmall" alt='profileImg'/> : 
          <span className="profPicSmall">
            <FaUser />
          </span>
          return (
          <div className="passenger" key={el.id}>
            { img }
            <span onClick={() => this.toggleProfPage(el)}>{el.name}</span>
          </div>
          )}
        )}
      </div>
    ) : null;
    return (
      <div
        className="tripPage"
        onClick={e =>
          e.target.className === "tripPage" ? this.props.toggle() : null
        }
      >
        {page}
        <div className="tripContent">
          <div className="padded">
            <p>{this.props.element.date}</p>
            <h3>
              {this.props.element.from}
              <span className="icon">
                <FaArrowRight />
              </span>
              {this.props.element.to}
            </h3>
            <p>
              {this.props.element.departTime}
              <span className="delimeter" />
              {this.props.element.arrivalTime}
            </p>
            {this.props.element.alsoTo ? <p>Проездом: {this.props.element.alsoTo}</p>: null}
            <hr />
            <div className="tripFlex">
              <div className="leftInfo">
                <div className="bottomInfo">
                  <span className="fontBig" style={{cursor: 'pointer'}} onClick={() => this.toggleProfPage(this.props.element.driver)}>
                    <img
                      src={this.props.element.driverPic}
                      className="profPic" alt='profileImg'
                    />
                    {this.props.element.driverName}
                  </span>
                </div>
              </div>
              <div className="rightInfo">
                <div className="bottomInfo">
                  <p className="comment">Комментарий водителя:</p>
                  <p className="comment">{this.props.element.comment}</p>
                </div>
              </div>
            </div>
            <hr />
            <div className="tripFlex">
              <div className="leftInfo">
                <div className="bottomInfo">{passengers}</div>
              </div>
              <div className="rightInfo">
                <div className="bottomInfo">
                  <p>Авто: {this.props.element.driverAuto}</p>
                  <p>Свободные места: {this.props.element.seatsRemain}</p>
                </div>
              </div>
            </div>
            <div>Связь: {this.props.element.driverPhone}</div>
            <br />
            <span>
              Цена: <span className="price">{this.props.element.price} р.</span>
            </span>
            <br />
            <hr />
          </div>
          {label}
          {cargo}
          {button}
        </div>
      </div>
    );
  }
}

export default TripPage;
