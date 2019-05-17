import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge';
import AccountsService, { Account } from '../services/AccountsService';
import AuthService from '../services/Auth';
import './AccountSelector.scss';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import { RouterProps } from 'react-router';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';

interface State {
  accounts: Account[];
}

class AccountSelector extends Component<AuthInfoProps & RouterProps, State> {

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
      key={acc.id}
      onClick={async (event: React.MouseEvent) => {
        event.stopPropagation();
        await AuthService.setAccount(acc.id);
        this.props.history.push('/');
      }}
      active={this.props.auth.accountId === acc.id}
      action
    >
      {acc.name} <Badge>{acc.id}</Badge>
    </ListGroupItem>;
  }

  render() {
    return <div style={headerContainerStyle} className='container'>
      <Header />
      <div style={headerSiblingStyle} className='AccountSelector'>
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
    </div>;
  }

}

export default withRouter(isLoggedInGuard(withAuthInfo(AccountSelector)));
