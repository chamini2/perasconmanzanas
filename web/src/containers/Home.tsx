import React, { Component } from 'react';
import AuthService from '../services/Auth';
import Dashboard from './Dashboard';
import Welcome from './Welcome';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import querystring from 'query-string';

class Home extends Component<RouteComponentProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    if (!AuthService.isLoggedIn()) {
      return <Welcome />;
    }

    const queryParams = querystring.parse(this.props.location.search);
    const back = queryParams.back;
    if (back && typeof back === 'string') {
      return <Redirect to={back} />;
    }

    return <Dashboard />;
  }
}

export default withRouter(Home);
