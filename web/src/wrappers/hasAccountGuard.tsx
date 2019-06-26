import React, { Component, ComponentClass, ComponentProps, ComponentType } from 'react';
import AuthService from '../services/Auth';
import { Redirect, withRouter, RouteComponentProps } from 'react-router';
import querystring from 'query-string';
import Paths from '../Paths';

export default function hasAccountGuard<P extends ComponentProps<any>>(WrappedComponent: ComponentType<P>): ComponentClass<P> {

  const klass = class extends Component<P & RouteComponentProps, {}> {
    symbol: symbol;

    constructor(props: any) {
      super(props);
      this.state = {};
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
      if (!AuthService.isAccountSet()) {
        const queryParams = querystring.parse(this.props.location.search);
        if (queryParams.back && typeof queryParams.back === 'string') {
          return <Redirect to={Paths.AccountSelector(queryParams.back)} />;
        } else {
          return <Redirect to={Paths.AccountSelector(this.props.location.pathname)} />;
        }
      }

      return <WrappedComponent {...this.props} />;
    }
  };

  return withRouter(klass) as unknown as ComponentClass<P>;

}
