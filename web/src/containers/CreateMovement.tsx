import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';

// TODO: check out CreateAccount on how to do it
class CreateMovement extends Component<AuthInfoProps> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className='container'>
      <h3>Nuevo movimiento</h3>
      PENDIENTE
    </div>;
  }

}

export default withAuthInfo(isLoggedInGuard(CreateMovement));
