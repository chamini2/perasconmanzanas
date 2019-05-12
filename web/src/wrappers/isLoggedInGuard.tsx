import React, { Component } from 'react';
import AuthService from '../services/Auth';
import { Redirect } from 'react-router';

export default function isLoggedInGuard(WrappedComponent: typeof Component): typeof Component {
  return class extends Component {
    symbol: symbol;

    constructor(props: any) {
      super(props);
      this.state = { };
      this.symbol = Symbol('isLoggedInGuard');
    }

    componentDidMount() {
      AuthService.subscribe(this.symbol, () => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      AuthService.unsubscribe(this.symbol);
    }

    render() {
      if (!AuthService.isLoggedIn()) {
        return <Redirect to='/' />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
}

export function isNotLoggedInGuard(WrappedComponent: typeof Component): typeof Component {
  return class extends Component {
    symbol: symbol;

    constructor(props: any) {
      super(props);
      this.state = { };
      this.symbol = Symbol('isLoggedInGuard');
    }

    componentDidMount() {
      AuthService.subscribe(this.symbol, () => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      AuthService.unsubscribe(this.symbol);
    }

    render() {
      if (AuthService.isLoggedIn()) {
        return <Redirect to='/' />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
}
