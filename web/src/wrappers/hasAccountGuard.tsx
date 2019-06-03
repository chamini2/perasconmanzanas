import React, { Component, ComponentClass, ComponentProps, ComponentType } from 'react';
import AuthService from '../services/Auth';
import { Redirect } from 'react-router';

export default function hasAccountGuard<P extends ComponentProps<any>>(WrappedComponent: ComponentType<P>, back: boolean = true): ComponentClass<P> {

  return class extends Component<P, {}> {
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
      if (!AuthService.isAccountSet()) {
        return <Redirect to='/accounts' push={back} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }

}
