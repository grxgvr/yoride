import React, { Component } from "react";
import Search from "../UI/Search/Search";
import { withRouter } from "react-router-dom";
import Button from "../UI/Button/Button";
import ResultList from "../ResultList/ResultList";
import TripPage from "../TripPage/TripPage";
import Input from "../UI/Input/Input";
import firebase from "firebase/app";
import Spinner from "../UI/Spinner/Spinner";
import "./SearchPage.css";

class SearchPage extends Component {
  state = {
    searchResults: [],
    isLoading: false,
    toggleWarning: false,
    isBooking: false,
    open: null
  };
  searchHandler = () => {
    let from = document.getElementsByClassName("SearchBar")[0].value,
      to = document.getElementsByClassName("SearchBar")[1].value,
      date = document.getElementById("date");
    if (date.value < date.min) {
      date.value = date.min;
    }
    if (from !== "" && to !== "") {
      this.setState({ isLoading: true, searchResults: [] });
      let ref = firebase
        .database()
        .ref(`/trips`)
        .child("/")
        .orderByChild("from")
        .startAt(from);
      let results = [];
      let trip, alsoTo;
      ref.once("value", snap => {
        snap.forEach(entry => {
          trip = entry.val();
          if(trip.alsoTo)
            alsoTo = trip.alsoTo.indexOf(to) > -1
          if ((trip.to.indexOf(to) > -1 || alsoTo) &&
            new Date(trip.date) > new Date(date.value))
            {
              trip.id = entry.key;
              let driver, info, ref = firebase.database().ref(`/users/${trip.driver}`)
              ref.once("value", snap => {
                info = snap.val();
                info.id = snap.key;
                trip.driver = {...info};
              });
              if (trip.passengers) {
                trip.seatsRemain = trip.seatsRemain - trip.passengers.length;
                let passengersArr = [];
                trip.passengers.forEach(id => {
                  ref = firebase.database().ref(`/users/${id}`);
                  ref.once("value", snap => {
                    info = snap.val();
                    info.id = snap.key;
                    passengersArr.push(info);
                  });
                  trip.passengers = passengersArr;
                });
            }
            if(trip.seatsRemain > 0)
            results.push(trip);
            }
        });
        if (results.length > 0)
          this.setState({ searchResults: results, isLoading: false });
        else this.setState({ isLoading: false });
      });
    }
  };
  toggleTripPage = id => {
    if (id) {
      this.setState({ open: id });
    } else {
      this.setState({ open: null });
    }
  };
  toggleProfPage = () => {
    if (this.state.toggleWarning) {
      this.setState({ toggleWarning: false });
    } else {
      this.setState({ toggleWarning: true });
    }
  };
  bookHandler = (uid, tripId) => {
    let tripAdd = false,
      userAdd = false;
    let db = firebase.database();
    let tripRef = db.ref(`/trips/${tripId}/passengers`);
    tripRef
      .once("value", snap => {
        let entry = snap.val();
        if (entry == null) {
          tripRef.set([uid]);
        } else {
          entry.push(uid);
          tripRef.set(entry);
        }
      })
      .then(res => {
        tripAdd = true;
        if (tripAdd && userAdd) this.props.history.push("/active");
      });
    let userRef = db.ref(`/users/${uid}/trips`);
    userRef
      .once("value", snap => {
        let entry = snap.val();
        if (entry == null) {
          userRef.set([tripId]);
        } else {
          entry.push(tripId);
          userRef.set(entry);
        }
      })
      .then(res => {
        userAdd = true;
        if (tripAdd && userAdd) this.props.history.push("/active");
      });
  };
  render() {
    let content = null,
      page = null;
    if (this.state.isLoading) content = <Spinner />;
    if (this.state.searchResults.length > 0) {
      let toggleFunc = this.props.isAuth
        ? this.toggleTripPage
        : this.toggleProfPage;
      content = (
        <ResultList takenTrips={this.state.searchResults} toggle={toggleFunc} />
      );
      page =
        this.state.open !== null && this.props.takenTrips !== null ? (
          <TripPage
            tripsIds={this.props.takenTrips.map(el => el.id)}
            element={
              this.state.searchResults.filter(
                el => el.id === this.state.open
              )[0]
            }
            toggle={this.toggleTripPage}
            book={() => this.bookHandler(this.props.uid, this.state.open)}
            tripId={this.state.open}
            uid={this.props.uid}
            delete={this.props.delete}
            cancelBook={this.props.cancelBook}
          />
        ) : null;
    }
    let warning =
      !this.props.isAuth && this.state.toggleWarning ? (
        <div
          className="tripPage"
          onClick={e =>
            e.target.className === "tripPage" ? this.toggleProfPage() : null
          }
        >
          <div className="card" style={{ padding: "15px", marginTop: "200px" }}>
            Необходима авторизация
          </div>
        </div>
      ) : null;
    return (
      <div className="Homepage">
        <div className="menu">
          <h2>Поиск поездки</h2>
          <Search placeHolder="Откуда" />
          <Search placeHolder="Куда" />
          <Input type="date" placeHolder="Когда" validated />
          <Button text="Найти" click={this.searchHandler} />
          {content}
          {warning}
          {page}
        </div>
      </div>
    );
  }
}

export default withRouter(SearchPage);
