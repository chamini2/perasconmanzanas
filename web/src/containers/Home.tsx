import React, { Component } from 'react';
import AuthService from '../services/Auth';
import Dashboard from './Dashboard';
import Welcome from './Welcome';

class Home extends Component {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    if (!AuthService.isLoggedIn()) {
      return <Welcome />;
    }

    return <Dashboard />;
  }
}

export default Home;
