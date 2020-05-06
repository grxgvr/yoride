import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import HelloPage from "../HelloPage/HelloPage";
import SearchPage from "../../Components/SearchPage/SearchPage";
import ActivePage from "../../Components/ActivePage/ActivePage";
import HistoryPage from "../../Containers/HistoryPage/HistoryPage";
import AddPage from "../../Components/AddPage/AddPage";
import Form from "../Form/Form";
import firebase from "firebase/app";
import "./App.css";
import Spinner from "../../Components/UI/Spinner/Spinner";

class App extends Component {
  state = {
    isAuth: null,
    userId: null,
    user: null,
    loading: true,
    suggestedTrips: null,
    takenTrips: null,
    historyTrips:null,
    isOk: false
  };
  componentWillMount = () => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let uid = user.uid;
        let db = firebase.database();
        let userRef = db.ref(`/users/${uid}`);
        let trips = db.ref("/trips");
        trips.once("value", snap => {
          snap.forEach(el => {
            if (new Date(el.val().date) < lastWeek)
              trips.child(el.key).remove();
          });
        });
        userRef.on("value", snap => {
          let userData = snap.val();
          let takenTrips = [], historyTrips = [];
          if (userData.trips) {
            userData.trips.forEach(trip => {
              trips.child(trip).once("value", snap => {
                if (snap.exists()) {
                  let el = snap.val();
                  let ref = firebase.database().ref(`/users/${el.driver}`), info
                  ref.once("value", snap => {
                    info = snap.val();
                    info.id = snap.key;
                    el.driver = {...info};
                  });
                  el.id = snap.key;
                  if(el.passengers) {
                    el.seatsRemain = el.seatsRemain - el.passengers.length;
                    let passengersArr = [];
                    el.passengers.forEach(id => {
                      ref = firebase.database().ref(`/users/${id}`);
                      ref.once("value", snap => {
                        info = snap.val();
                        info.id = snap.key;
                        passengersArr.push(info);
                      });
                      el.passengers = passengersArr;
                    });
                  }
                  if(new Date(el.date) < today)
                    historyTrips.push(el)
                  else
                    takenTrips.push(el);
                } else {
                  userRef.child("trips").once("value", snap => {
                    let tripsArr = snap.val();
                    let i = tripsArr.indexOf(trip);
                    if (i > -1) {
                      tripsArr.splice(i, 1);
                    }
                    userRef.child("trips").set(tripsArr);
                  });
                }
              });
            });
          }
          this.setState({ user: userData, takenTrips, historyTrips });
        });
        let data = db
          .ref(`/trips`)
          .orderByChild("driver")
          .equalTo(uid);
        data.on("value", snap => {
          let results = [];
          snap.forEach(el => {
            let entry = el.val();
            if(new Date(entry.date) >= new Date()){
            entry.id = el.key;
            if (entry.passengers) {
              entry.seatsRemain = entry.seatsRemain - entry.passengers.length;
              let passengersArr = [];
              entry.passengers.forEach(id => {
                let ref = firebase.database().ref(`/users/${id}`);
                ref.once("value", snap => {
                  let info = snap.val();
                  info.id = snap.key;
                  passengersArr.push(info);
                });
                entry.passengers = passengersArr;
              });
            }
            results.push(entry);
          }
          });
          this.setState({ suggestedTrips: results });
        });
        this.setState({ isAuth: true, userId: uid });
      } else {
        this.setState({
          isAuth: false,
          userId: null,
          suggestedTrips: null,
          takenTrips: null,
          user: null
        });
      }
    });
  };
  login = () => {
    this.props.history.push("/search");
  };
  logout = () => {
    firebase.auth().signOut();
  };
  deleteTrip = id => {
    firebase
      .database()
      .ref(`/trips/${id}`)
      .remove();
  };
  cancelBook = id => {
    let userRef = firebase.database().ref(`/users/${this.state.userId}`);
    userRef.child("trips").once("value", snap => {
      let tripsArr = snap.val();
      let i = tripsArr.indexOf(id);
      if (i > -1) {
        tripsArr.splice(i, 1);
      }
      userRef.child("trips").set(tripsArr);
    });
    let tripsRef = firebase.database().ref(`/trips/${id}`);
    tripsRef.child("passengers").once("value", snap => {
      let passArr = snap.val();
      let i = passArr.indexOf(this.state.userId);
      if (i > -1) {
        passArr.splice(i, 1);
      }
      tripsRef.child("passengers").set(passArr);
    });
  };
  render() {
    console.log(this.state.historyTrips)
    let app;
    if (
      (this.state.isAuth &&
      this.state.user !== null &&
      this.state.suggestedTrips !== null &&
      this.state.takenTrips !== null) || this.state.isAuth === false
    )
      app = (
        <div>
          <Navbar
            auth={this.state.isAuth}
            logout={this.logout}
            user={this.state.user}
            uid={this.state.userId}
          />
          <div className="bc">
            <Switch>
              <Route
                path="/login"
                render={() => (
                  <div className="HelloBox">
                    <Form
                      login={this.login}
                      base={this.state.firebase}
                      isAuth={this.state.isAuth}
                    />
                  </div>
                )}
              />
              <Route
                path="/search"
                render={() => (
                  <SearchPage
                    uid={this.state.userId}
                    user={this.state.user}
                    suggestedTrips={this.state.suggestedTrips}
                    takenTrips={this.state.takenTrips}
                    isAuth={this.state.isAuth}
                    delete={this.deleteTrip}
                    cancelBook={this.cancelBook}
                  />
                )}
              />
              <Route
                path="/history"
                render={() => (
                  <HistoryPage
                    user={this.state.user}
                    historyTrips={this.state.historyTrips}
                    isAuth={this.state.isAuth}
                    uid={this.state.userId}
                  />
                )}
              />
              <Route
                path="/active"
                render={() => (
                  <ActivePage
                    user={this.state.user}
                    suggestedTrips={this.state.suggestedTrips}
                    takenTrips={this.state.takenTrips}
                    isAuth={this.state.isAuth}
                    uid={this.state.userId}
                    delete={this.deleteTrip}
                    cancelBook={this.cancelBook}
                  />
                )}
              />
              <Route
                path="/add"
                render={() => <AddPage isAuth={this.state.isAuth} />}
              />
              <Route
                path="/"
                exact
                render={() => <HelloPage auth={this.state.isAuth} />}
              />
            </Switch>
          </div>
        </div>
      );
    else  app = (
        <div className="bc">
           <Navbar
            auth={false}
          />
          <div className='loadScreen'>
            <Spinner />
          </div>
        </div>
      );
    return <div className="App">{app}</div>;
  }
}

export default withRouter(App);
