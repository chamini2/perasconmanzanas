import React, { Component, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button'
import Auth from '../services/Auth';
import AccountsService, { Account } from '../services/AccountsService';
import './Header.css';

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

export default class Header extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (Auth.isAccountSet()) {
      const accountId = Auth.getAccount()!;
      const account = await AccountsService.fetchAccount(accountId);
      this.setState({ account });
    }
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

  account() {
    if (!this.state.account) {
      return null;
    }

    return <span>
      {this.state.account.name}
    </span>;
  }

  render() {
    return <div className="Header">
      {this.account()}
      {this.logoutButton()}
    </div>;
  }

}
