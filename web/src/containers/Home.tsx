import React, { Component } from 'react';
import AuthService from '../services/Auth';
import Dashboard from './Dashboard';
import Welcome from './Welcome';
import { Redirect } from 'react-router';

class Home extends Component {

  render() {
    if (!AuthService.isLoggedIn()) {
      return <Welcome />;
    }

    if (!AuthService.isAccountSet()) {
      return <Redirect to='/accounts' />;
    }

    return <Dashboard />;
  }
}

export default Home;
