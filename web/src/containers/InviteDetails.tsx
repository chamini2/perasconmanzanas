import React, { Component } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import Button from 'react-bootstrap/Button';
import Header, { headerSiblingStyle, headerContainerStyle } from '../components/Header';
import InvitesService, { Invite } from '../services/InvitesService';
import { toast } from 'react-toastify';
import { STRINGS } from '../constants';
import { AxiosResponse } from 'axios';
import { errorPGMessage } from '../services/Request';
import isUndefined from 'lodash/isUndefined';
import AuthService from '../services/Auth';
import Paths from '../Paths';

interface RouteParams {
  account: string;
  code: string;
}

interface State {
  invite: Invite | undefined | null;
}

class InviteDetails extends Component<RouteComponentProps<RouteParams>, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      invite: undefined
    };
  }

  async componentDidMount() {
    try {
      const invite = await InvitesService.fetchInvite(this.props.match.params.account, this.props.match.params.code);
      this.setState({ invite });
    } catch (err) {
      this.setState({ invite: null });
      console.error(err);
      if (err.response) {
        const errResponse = err.response as AxiosResponse<string>;
        toast('Error en petición: ' + errorPGMessage(errResponse), { type: 'error' });
      } else {
        toast(STRINGS.UNKNOWN_ERROR, { type: 'error' });
      }
    }
  }

  render() {
    const { invite } = this.state;

    if (isUndefined(invite)) {
      return <h3>Cargando invitación...</h3>;
    }

    if (invite === null) {
      return <div>
        <h3>Invitación no encontrada</h3>
        <Link to='/'>Ir al inicio</Link>
      </div>;
    }

    return <div className='InviteDetails container' style={{ height: '100%' }}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <h3>
          Invitación a unirse a <br/>
          <code>{invite.account_id}</code>
        </h3>

        <code>{invite.notes}</code>

        <Button
          size='lg'
          onClick={async (event: React.MouseEvent) => {
            event.stopPropagation();
            if (!AuthService.isLoggedIn()) {
              toast('Inicia sesión para unirte', { type: 'info' });
              this.props.history.push(Paths.Home(this.props.location.pathname));
              return;
            }

            try {
              await InvitesService.claimInvite(this.props.match.params.account, this.props.match.params.code);
              this.props.history.push(Paths.AccountSelector());
            } catch (err) {
              console.error(err);
              if (err.response) {
                const errResponse = err.response as AxiosResponse<string>;
                toast('Error en petición: ' + errorPGMessage(errResponse), { type: 'error' });
              } else {
                toast(STRINGS.UNKNOWN_ERROR, { type: 'error' });
              }
            }
          }}
        >
          Unirse
        </Button>

        <Link to='/'>Ir al inicio</Link>
      </div>
    </div>;
  }

}

export default withRouter(InviteDetails);
