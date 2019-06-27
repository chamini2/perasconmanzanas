import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Badge from 'react-bootstrap/Badge';
import AccountsService, { Account } from '../services/AccountsService';
import AuthService from '../services/Auth';
import './AccountSelector.scss';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import { RouteComponentProps, Redirect } from 'react-router';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import isUndefined from 'lodash/isUndefined';
import querystring from 'query-string';
import Paths from '../Paths';

interface State {
  accounts: Account[] | undefined;
  back?: string;
}

class AccountSelector extends Component<AuthInfoProps & RouteComponentProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      accounts: undefined
    };
  }

  async componentDidMount() {
    const queryParams = querystring.parse(this.props.location.search);
    const back = queryParams.back;
    if (back && typeof back === 'string') {
      this.setState({ back });
    }

    const result = await AccountsService.fetchAllAccounts();
    this.setState({ accounts: result.data });
  }

  renderAccount = (acc: Account) => {
    return <ListGroupItem
      key={acc.id}
      onClick={async (event: React.MouseEvent) => {
        event.stopPropagation();
        await AuthService.setAccount(acc.id);

        // let `render` take care of the redirect to `back`
        if (isUndefined(this.state.back)) {
          this.props.history.push(Paths.Home());
        }

      }}
      active={this.props.auth.accountId === acc.id}
      action
    >
      {acc.name} <Badge variant='primary'>{acc.id}</Badge>
    </ListGroupItem>;
  }

  render() {
    const {
      accounts,
      back
    } = this.state;

    if (!isUndefined(back) && this.props.auth.accountId) {
      return <Redirect to={back} />;
    }

    return <div style={headerContainerStyle} className='container'>
      <Header />
      <div style={headerSiblingStyle} className='AccountSelector'>
        <h3>Selecciona el proyecto en el que vas a trabajar</h3>
        <ListGroup>
          {
            isUndefined(accounts)
              ? <ListGroupItem>Cargando...</ListGroupItem>
              : accounts.map(this.renderAccount)
          }
          <ListGroupItem
            href='/accounts/new'
            variant='secondary'
            action
            style={{ cursor: 'pointer' }}
          >
            Crear un proyecto
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>;
  }

}

export default withRouter(withAuthInfo(isLoggedInGuard(AccountSelector)));
