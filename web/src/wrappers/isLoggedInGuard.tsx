import React, { Component } from 'react';
import Auth from '../services/Auth';
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
      Auth.subscribe(this.symbol, () => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      Auth.unsubscribe(this.symbol);
    }

    render() {
      if (!Auth.isLoggedIn()) {
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
      Auth.subscribe(this.symbol, () => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      Auth.unsubscribe(this.symbol);
    }

    render() {
      if (Auth.isLoggedIn()) {
        return <Redirect to='/' />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
}
