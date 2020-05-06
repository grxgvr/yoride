import React, { Component } from "react";
import {
  FaRoad,
  FaUserCircle,
  FaSuitcase,
  FaSearch,
  FaPlusCircle,
  FaBars,
  FaHistory
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ProfilePage from '../ProfilePage/ProfilePage';
import "./Navbar.css";

class Navbar extends Component {
  state = {
    isLoggedIn: false,
    userData: null,
    open: false,
    menuCollapsed: true
  };
  toggleProfPage = () => {
    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  };
  toggleMenu = () => {
    if (this.state.menuCollapsed) {
      this.setState({ menuCollapsed: false });
    } else {
      this.setState({ menuCollapsed: true });
    }
  }
  closeMenu = () => {
    if(!this.state.menuCollapsed)
      this.setState({ menuCollapsed: true });
  }
  render() {
    let content;
    let page = this.state.open && this.props.user ? (
        <ProfilePage user={this.props.user} uid={this.props.uid} toggle={this.toggleProfPage} logout={this.props.logout} isUser={true}/>
    ) : null;
    if (this.props.auth)
      content = (
        <ul>
          <li id="brand" onClick={this.closeMenu}>
            <NavLink to="/">
              <span className="icon">
                <FaRoad />
              </span>
              Попутчик!
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/history">
              <span className="icon">
                <FaHistory />
              </span>
              История поездок
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/active">
              <span className="icon">
                <FaSuitcase />
              </span>
              Активные поездки
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/search">
              <span className="icon">
                <FaSearch />
              </span>
              Поиск
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/add">
              <span className="icon">
                <FaPlusCircle />
              </span>
              Предложить
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <a onClick={() => this.toggleProfPage(this.props.uid)}>
              <span className="icon">
                <FaUserCircle />
              </span>
              Профиль
            </a>
          </li>
          <li id='toggleMenu' onClick={this.toggleMenu}>
              <a className="icon">
                <FaBars />
              </a>
          </li>
        </ul>
      );
    else
      content = (
        <ul>
          <li id="brand" onClick={this.closeMenu}>
            <NavLink to="/">
              <span className="icon">
                <FaRoad />
              </span>
              Попутчик!
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/search">
              <span className="icon">
                <FaSearch />
              </span>
              Поиск
            </NavLink>
          </li>
          <li onClick={this.closeMenu}>
            <NavLink to="/login">
              <span className="icon">
                <FaUserCircle />
              </span>
              Войти
            </NavLink>
          </li>
          <li id='toggleMenu' onClick={this.toggleMenu}>
            <a className="icon">
                <FaBars />
              </a>
          </li>
        </ul>
      );
      let menu = this.state.menuCollapsed ? null : (
        <div className='collapseMenu'>
          {content}
        </div>
      )
    return (
      <div>
        <div className="bar">{content}</div>
        {page}
        {menu}
      </div>
    );
  }
}

export default Navbar;
