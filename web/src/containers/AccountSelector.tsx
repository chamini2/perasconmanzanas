import React, { Component } from 'react';
import AccountsService, { Account } from '../services/AccountsService';
import Auth from '../services/Auth';
import './AccountSelector.scss';

interface State {
  accounts: Account[];
}

export default class AccountSelector extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: []
    };
  }

  async componentDidMount() {
    const result = await AccountsService.fetchAllAccounts();
    this.setState({ accounts: result.data });
  }

  renderAccount = (acc: Account) => {
    return <span
      key={acc.id}
      onClick={(event) => {
        event.stopPropagation();
        Auth.setAccount(acc.id);
      }}
    >
      {acc.name} ({acc.id})
    </span>;
  }

  render() {
    return (
      <div className="AccountSelector">
        {this.state.accounts.map(this.renderAccount)}
      </div>
    );
  }
}
