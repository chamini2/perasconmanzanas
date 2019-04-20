import React, { Component, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button'
import Auth from '../services/Auth';
import AccountsService, { Account } from '../services/AccountsService';

interface State {
  account?: Account
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
        className="btn-secondary"
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
    return <div
      style={{
        width: "100%",
      }}
    >
      {this.account()}
      {this.logoutButton()}
    </div>;
  }

}
