import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge';
import AccountsService, { Account } from '../services/AccountsService';
import Auth from '../services/Auth';
import './AccountSelector.scss';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

interface State {
  accounts: Account[];
}

export class AccountSelector extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: [],
    };
  }

  async componentDidMount() {
    const result = await AccountsService.fetchAllAccounts();
    this.setState({ accounts: result.data });
  }

  renderAccount = (acc: Account) => {
    return <ListGroupItem
      as={Link}
      to='/'
      key={acc.id}
      onClick={async (event: React.MouseEvent) => {
        event.stopPropagation();
        await Auth.setAccount(acc.id);
      }}
      active={this.props.auth.accountId === acc.id}
      action
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
            as={Link}
            to='/accounts/new'
            variant='secondary'
            action
          >
            Crear una cuenta
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }

}

export default withAuthInfo(AccountSelector);
