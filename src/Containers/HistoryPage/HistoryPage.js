import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ResultList from "../../Components/ResultList/ResultList";
import TripPage from "../../Components/TripPage/TripPage";
import Spinner from "../../Components/UI/Spinner/Spinner";

class HistoryPage extends Component {
    state = {
        isLoading: true,
        historyTrips: null,
        open: null
    };
    componentWillMount = () => {
        if(!this.props.isAuth) this.props.history.push('/');
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
        let content = this.props.historyTrips.length ?
            <ResultList
              historyTrips={this.props.historyTrips}
              toggle={this.toggleTripPage}
              intention='history'
            /> : <div>Совершите поездку, чтобы она появилась в истории!</div>
        let page =
            this.state.open !== null ? (
              <TripPage
              tripsIds={this.props.historyTrips.map(el => el.id)}
                element={
                    this.props.historyTrips.filter(
                    el => el.id === this.state.open
                  )[0]
                }
                toggle={this.toggleTripPage}
                intention='history'
                uid={this.props.uid}
              />
            ) : null;
        return (
            <div className="Homepage">
                <div className="menu">
                    <h2>История поездок</h2>
                    {content}
                    {page}
                </div>
            </div>
        )
    }
}

export default withRouter(HistoryPage);