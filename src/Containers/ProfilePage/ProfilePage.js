import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./ProfilePage.css";
import Spinner from "../../Components/UI/Spinner/Spinner";

class ProfilePage extends Component {
  
  render() {
    let buttons = this.props.isUser ? <span>
            <button className="cardButton exit" onClick={this.props.logout}>
              Выйти
            </button>
    </span> : <br/>
    let content =
      this.props.user == null ? (
        <Spinner />
      ) : (
        <div
        className="tripPage prof"
        onClick={e =>
          e.target.className === "tripPage prof" ? this.props.toggle() : null
        }
      >
        <div className="card">
          <img src={this.props.user.photoURL} className="profPicBig" alt='profileImage'/>
          <h1>{this.props.user.name}</h1>
          <p className="title">{this.props.user.phone}</p>
          <p>Машина: {this.props.user.auto}</p>
            {buttons}
        </div>
        </div>
      );
    return <div>{content}</div>;
  }
}

export default withRouter(ProfilePage);
