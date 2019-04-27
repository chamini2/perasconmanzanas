import React, { Component } from 'react';
import Auth from '../services/Auth';

export interface AuthInfoProps {
  auth: AuthInfo;
}

export interface AuthInfo {
  user: number | undefined;
  account: string | undefined;
}

export default function withAuthInfo(WrappedComponent: typeof Component): typeof Component {
  return class extends Component<any, AuthInfo> {
    symbol: symbol;

    constructor(props: any) {
      super(props);
      this.state = {
        user: Auth.getUser(),
        account: Auth.getAccount()
      };

      this.symbol = Symbol('withAuthInfo');
    }

    componentDidMount() {
      Auth.subscribe(this.symbol, () => {
        this.setState({
          user: Auth.getUser(),
          account: Auth.getAccount()
        })
      });
    }

    componentWillUnmount() {
      Auth.unsubscribe(this.symbol);
    }

    render() {
      return <WrappedComponent {...this.props} auth={this.state} />;
    }
  }
}
