import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ResultList from "../ResultList/ResultList";
import TripPage from "../TripPage/TripPage";
import Spinner from "../UI/Spinner/Spinner";
class ActivePage extends Component {
  state = {
    isLoading: true,
    suggestedTrips: null,
    open: null
  };
  componentWillMount = () => {
    if(this.props.suggestedTrips === null || !this.props.isAuth) this.props.history.push('/');
  }
  toggleTripPage = id => {
    if (id) {
      this.setState({ open: id });
    } else {
      this.setState({ open: null });
    }
  };
  render() {
    if(!this.props.isAuth) this.props.history.push('/');
    let content = null,
      data = null,
      st = [],
      tt = [],
      page = null;
      if(this.props.suggestedTrips !== null || this.props.takenTrips !== null){
        if(this.props.suggestedTrips.length > 0 && this.props.takenTrips.length > 0){
          data = this.props.suggestedTrips.concat(this.props.takenTrips)
          st = this.props.suggestedTrips;
          tt = this.props.takenTrips;
        }
        else if(this.props.suggestedTrips.length > 0){
          data = this.props.suggestedTrips;
          st = data;
        }
        else if(this.props.takenTrips.length > 0){
          data = this.props.takenTrips;
          tt = data;
        }
      content = data !== null ?
        <ResultList
          suggestedTrips={st}
          takenTrips={tt}
          toggle={this.toggleTripPage}
          intention='active'
        /> : <div>Пока что без поездок :(</div>
      page =
        this.state.open !== null ? (
          <TripPage
          tripsIds={data.map(el => el.id)}
            element={
              data.filter(
                el => el.id === this.state.open
              )[0]
            }
            toggle={this.toggleTripPage}
            intention='active'
            uid={this.props.uid}
            delete={this.props.delete}
            cancelBook={this.props.cancelBook}
          />
        ) : null;
      } else content = <Spinner />
    return (
      <div className="Homepage">
        <div className="menu">
          <h2>Активные поездки</h2>
          {content}
          {page}
        </div>
      </div>
    );
  }
}

export default withRouter(ActivePage);
