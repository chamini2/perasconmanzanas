import React, { Component, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button'
import Auth from '../services/Auth';
import AccountsService, { Account } from '../services/AccountsService';
import './Header.css';
import withAuthInfo, { AuthInfoProps, AuthInfo } from '../wrappers/withAuthInfo';

interface State {
  account?: Account
}

export const headerContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

export const headerSiblingStyle: React.CSSProperties = {
  flexGrow: 1,
  overflow: 'auto'
}

export class Header extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  logoutButton() {
    return <Button
        className='btn-secondary'
        onClick={function(event: MouseEvent) {
          event.stopPropagation();
          Auth.logout();
        }}
      >
      Cerrar sesión
      </Button>;
  }

  async componentWillReceiveProps(nextProps: AuthInfoProps) {
    if (this.props.auth.account === nextProps.auth.account) {
      return;
    }
    await this.updateAccountFromAuthInfo(nextProps.auth);
  }

  async componentDidMount() {
    await this.updateAccountFromAuthInfo(this.props.auth);
  }

  async updateAccountFromAuthInfo(auth: AuthInfo) {
    if (!auth.account) {
      return;
    }

    const account = await AccountsService.fetchAccount(auth.account);
    this.setState({ account });
  }

  account() {
    if (!this.state.account) {
      return null;
    }

    return <span> {this.state.account.name} </span>;
  }

  render() {
    return <div className="Header">
      {this.account()}
      {this.logoutButton()}
    </div>;
  }

}

export default withAuthInfo(Header);
