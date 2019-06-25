import './InvitesManager.scss';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Header, { headerContainerStyle, headerSiblingStyle } from '../components/Header';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import InvitesService, { Invite } from '../services/InvitesService';
import isUndefined from 'lodash/isUndefined';
import { timestampDateFormat } from '../helpers';
import { BASE_WEB_URL } from '../constants';
import { toast } from 'react-toastify';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import isEmpty from 'lodash/isEmpty';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import * as Paths from '../Paths';

interface State {
  claimed: Invite[] | undefined;
  unclaimed: Invite[] | undefined;
  deleted: boolean[];
  notes: string;
}

class InvitesManager extends Component<AuthInfoProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      claimed: undefined,
      unclaimed: undefined,
      deleted: [],
      notes: '',
    };
  }

  async componentDidMount() {
    this.setState({ claimed: undefined, unclaimed: undefined, deleted: [] });

    const claimedResult = await InvitesService.fetchClaimedInvites();
    const unclaimedResult = await InvitesService.fetchUnclaimedInvites();

    this.setState({
      claimed: claimedResult.data,
      unclaimed: unclaimedResult.data
    });
  }

  handleChange(key: keyof State): FormControl['props']['onChange'] {
    return event => {
      event.preventDefault();

      this.setState({
        [key]: (event as any).target.value
      } as State);
    };
  }

  renderUnclaimedInvite = (invite: Invite, index: number) => {
    const isDeleted = this.state.deleted[index];
    return <ListGroupItem
      key={invite.id}
      className='invite'
    >
      <code className='notes'>{invite.notes}</code>
      <span style={{display: 'flex'}}>
        <code>{timestampDateFormat(invite.created_at)}</code>
        <div
          hidden={!isDeleted}
          className='action'
          title='Deshacer eliminado'
          onClick={async (event: React.MouseEvent) => {
            event.stopPropagation();
            await InvitesService.postInvite({ ...invite, claimed_by: undefined });

            toast('Invitación creada', { type: 'success', toastId: 'invite-created' });

            const deleted = [...this.state.deleted];
            deleted[index] = false;
            this.setState({ deleted });
          }}
        >
          ⏮
        </div>

        <div
          hidden={isDeleted}
          className='action'
          title='Copiar enlace'
          onClick={async (event: React.MouseEvent) => {
            event.stopPropagation();

            // Code from: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
            const el = document.createElement('textarea');
            el.value = BASE_WEB_URL + Paths.InviteDetails(invite.account_id, invite.id);
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.width = '0px';
            el.style.height = '0px';
            el.style.overflow = 'hidden';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            toast('Enlace copiado', { type: 'info', toastId: 'invite-clipboard-copied' });
          }}
        >
          📋
        </div>

        <div
          hidden={isDeleted}
          className='action'
          title='Eliminar'
          onClick={async (event: React.MouseEvent) => {
            event.stopPropagation();
            await InvitesService.deleteInvite(invite.id);

            toast('Invitación eliminada', { type: 'error', toastId: 'invite-deleted' });

            const deleted = [...this.state.deleted];
            deleted[index] = true;
            this.setState({ deleted });
          }}
        >
          🗑
        </div>
      </span>
    </ListGroupItem>;
  }

  renderClaimedInvite = (invite: Invite) => {
    return <ListGroupItem
      key={invite.id}
      className='invite'
    >
      <code className='notes'> {invite.notes} </code>
      <span> Por <code>{invite.claimed_by!.full_name}</code> el <code>{timestampDateFormat(invite.claimed_at)}</code> </span>
      <code> {timestampDateFormat(invite.created_at)} </code>
    </ListGroupItem>;
  }

  undefinedIsLoading(invites: Invite[] | undefined, renderFn: (invite: Invite, index: number) => JSX.Element) {
    if (isUndefined(invites)) {
      return <ListGroupItem> Cargando... </ListGroupItem>;
    } else if (isEmpty(invites)) {
      return <ListGroupItem> No hay invitaciones </ListGroupItem>;
    } else {
      return invites.map(renderFn);
    }
  }

  render() {
    const {
      claimed,
      unclaimed,
      notes
    } = this.state;

    return <div style={headerContainerStyle} className='container'>
      <Header />
      <div style={headerSiblingStyle} className='InvitesManager'>
      <h3>Enviar invitación</h3>
        <Form
          onSubmit={async (event: React.FormEvent) => {
            event.preventDefault();
            event.stopPropagation();
            await InvitesService.postInvite({ account_id: this.props.auth.accountId, notes: this.state.notes });

            toast('Invitación creada', { type: 'success', toastId: 'invite-created' });

            this.setState({ notes: '' });
            this.componentDidMount();
          }}
        >
          <FormGroup>
            <FormLabel>Notas: para recordar el propósito de la invitación (a quién se la enviaste, etc.)</FormLabel>
            <FormControl
              value={notes}
              onChange={this.handleChange('notes')}
            />
          </FormGroup>
          <Button type='submit'>
            Enviar
          </Button>
        </Form>

        <h3>Invitaciones enviadas</h3>
        <div>
          Copia el enlace de la invitación que quieras enviar y
          pásalo al destinatario por correo, mensaje u otro medio.
        </div>
        <ListGroup>
          {this.undefinedIsLoading(unclaimed, this.renderUnclaimedInvite)}
        </ListGroup>

        <h3>Invitaciones usadas</h3>
        <ListGroup>
          {this.undefinedIsLoading(claimed, this.renderClaimedInvite)}
        </ListGroup>
      </div>
    </div>;
  }

}

export default withAuthInfo(hasAccountGuard(isLoggedInGuard(InvitesManager)));
