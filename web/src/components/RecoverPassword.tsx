import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RecoverPassword extends Component {

  constructor(props: any) {
    super(props);

    this.state = {};
  }

  render() {
    return <Link
      className='RecoverPassword'
      to='/'
      style={{
        textAlign: 'center'
      }}
    >
      {/* TODO: this */}
      Olvidé mi contraseña <br/>
      PENDIENTE
    </Link>;
  }
}

export default RecoverPassword;
