import React, { Component } from 'react';
import AccountSelector from './AccountSelector';
import Header from '../components/Header';
import Auth from '../services/Auth';
import { Redirect } from 'react-router';

export default class Profile extends Component {

  render() {
    if (!Auth.isLoggedIn()) {
      return <Redirect to="/" />;
    }

    return <div>
      <Header />
      <AccountSelector />
    </div>;
  }

}
