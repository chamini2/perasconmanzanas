import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge';
import AccountsService, { Account } from '../services/AccountsService';
import Auth, { SessionToken } from '../services/Auth';
import './AccountSelector.scss';

interface State {
  accounts: Account[];
  selected: SessionToken['account'];
}

export default class AccountSelector extends Component<any, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: [],
      selected: undefined
    };
  }

  async componentDidMount() {
    const account = Auth.getAccount();
    this.setState({ selected: account });

    const result = await AccountsService.fetchAllAccounts();
    this.setState({ accounts: result.data });
  }

  renderAccount = (acc: Account) => {
    return <ListGroupItem
      className={this.state.selected === acc.id ? 'active' : ''}
      key={acc.id}
      onClick={async (event: any) => {
        event.stopPropagation();
        await Auth.setAccount(acc.id);
      }}
    >
      {acc.name} <Badge>{acc.id}</Badge>
    </ListGroupItem>;
  }

  render() {
    return (
      <div className='AccountSelector'>
        <h3>Selecciona en la cuenta que vas a trabajar</h3>
        <ListGroup>
          {this.state.accounts.map(this.renderAccount)}
          <ListGroupItem
            as='a'
            href='/profile/new'
            className='list-group-item-secondary list-group-item-action'
          >
            Crear una cuenta
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}
