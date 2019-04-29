import React, { Component } from 'react';
import Auth from '../services/Auth';
import Dashboard from './Dashboard';
import Welcome from './Welcome';
import { Redirect } from 'react-router';

export default class Home extends Component {

  render() {
    if (!Auth.isLoggedIn()) {
      return <Welcome />;
    }

    if (!Auth.isAccountSet()) {
      return <Redirect to='/settings' />;
    }

    return <Dashboard />;
  }
}
