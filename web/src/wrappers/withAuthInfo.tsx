import React, { Component, ComponentClass, ComponentProps, ComponentType } from 'react';
import AuthService, { SessionRole } from '../services/Auth';
import UsersService, { User } from '../services/UsersService';
import AccountsService, { Account } from '../services/AccountsService';
import * as rxjs from 'rxjs';

export interface AuthInfoProps {
  auth: AuthInfo;
}

export interface AuthInfo {
  userId: number | undefined;
  user: User | undefined;
  accountId: string | undefined;
  account: Account | undefined;
  role: SessionRole | undefined;
}

class AuthInfoHandler {

  static userId?: number;
  static user?: User;
  static accountId?: string;
  static account?: Account;
  static role?: SessionRole;

  static observable: rxjs.ReplaySubject<void> = new rxjs.ReplaySubject();

  static async updateAuthInfo() {
    this.userId = AuthService.getUser();
    this.accountId = AuthService.getAccount();
    this.role = AuthService.getRole();

    if (!this.userId) {
      this.user = undefined;
    }

    if (!this.accountId) {
      this.account = undefined;
    }

    if (this.userId && (!this.user || this.user.id !== this.userId)) {
      this.user = await UsersService.fetchUser(this.userId);
    }

    if (this.accountId && (!this.account || this.account.id !== this.accountId)) {
      this.account = await AccountsService.fetchAccount(this.accountId);
    }

    AuthInfoHandler.observable.next();
  }

}

AuthInfoHandler.updateAuthInfo();

AuthService.subscribe(Symbol('AuthInfo'), () => {
  AuthInfoHandler.updateAuthInfo();
});

interface State {
  info: AuthInfo;
  ready: boolean
}

export default function withAuthInfo<P extends ComponentProps<any>>(WrappedComponent: ComponentType<AuthInfoProps & P>): ComponentClass<P, State> {

  return class extends Component<P, State> {
    symbol: symbol;
    authInfoHandlerSubscription?: rxjs.Subscription;

    constructor(props: any) {
      super(props);

      this.state = {
        info: {
          userId: AuthInfoHandler.userId,
          user: AuthInfoHandler.user,
          accountId: AuthInfoHandler.accountId,
          account: AuthInfoHandler.account,
          role: AuthInfoHandler.role,
        },
        ready: false
      };

      this.symbol = Symbol('withAuthInfo');
    }

    componentWillMount() {
      this.authInfoHandlerSubscription = AuthInfoHandler.observable.subscribe(() => {
        this.setState({
          info: {
            userId: AuthInfoHandler.userId,
            user: AuthInfoHandler.user,
            accountId: AuthInfoHandler.accountId,
            account: AuthInfoHandler.account,
            role: AuthInfoHandler.role,
          },
          ready: true,
        });
      });
    }

    componentWillUnmount() {
      if (this.authInfoHandlerSubscription) {
        this.authInfoHandlerSubscription.unsubscribe();
      }
    }

    render() {
      if (this.state.ready) {
        return <WrappedComponent
          {...this.props}
          auth={this.state.info}
        />;
      } else {
        return null;
      }
    }
  };

}
