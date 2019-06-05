import React, { Component, ComponentClass, ComponentProps, ComponentType } from 'react';
import AuthService from '../services/Auth';
import { Redirect, withRouter, RouteComponentProps } from 'react-router';
import querystring from 'query-string';
import * as Paths from '../Paths';

export default function isLoggedInGuard<P extends ComponentProps<any>>(WrappedComponent: ComponentType<P>): ComponentClass<P> {

  const klass = class extends Component<P & RouteComponentProps, {}> {
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
        const queryParams = querystring.parse(this.props.location.search);
        if (queryParams.back && typeof queryParams.back === 'string') {
          return <Redirect to={Paths.Home(queryParams.back)} />;
        } else {
          return <Redirect to={Paths.Home(this.props.location.pathname)} />;
        }
      }

      return <WrappedComponent {...this.props} />;
    }
  };

  return withRouter(klass) as unknown as ComponentClass<P>;

}

export function isNotLoggedInGuard<P extends ComponentProps<any>>(WrappedComponent: ComponentType<P>): ComponentClass<P> {

  const klass = class extends Component<P & RouteComponentProps, {}> {
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
        const queryParams = querystring.parse(this.props.location.search);
        if (queryParams.back && typeof queryParams.back === 'string') {
          return <Redirect to={Paths.Home(queryParams.back)} />;
        } else {
          return <Redirect to={Paths.Home(this.props.location.pathname)} />;
        }
      }

      return <WrappedComponent {...this.props} />;
    }
  };

  return withRouter(klass) as unknown as ComponentClass<P>;

}
