import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';

interface State {
  showModal: boolean;
}

class RecoverPassword extends Component<{}, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  showModal() {
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      showModal
    } = this.state;

    return <div style={{ margin: 'auto' }}>
      <Button
        className='RecoverPassword'
        variant='link'
        onClick={this.showModal.bind(this)}
      >
        Olvidé mi contraseña
      </Button>
      <Modal className='Modal-RecoverPassword' show={showModal} onHide={this.hideModal.bind(this)}>
        <Modal.Header closeButton> Recuperar contraseña </Modal.Header>
        <Modal.Body>
          Por ahora no tenemos un sistema de recuperación de contraseña.<br/>
          Contáctame por la burbuja de chat abajo a la derecha de la pantalla para enviarte una nueva contraseña.
        </Modal.Body>
      </Modal>
    </div>;
  }
}

export default RecoverPassword;
