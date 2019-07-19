import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import Button from 'react-bootstrap/Button';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import ProductForm from './ProductForm';
import Paths from '../Paths';

interface State {
  isValid: boolean;
}

class CreateProduct extends Component<RouteComponentProps, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      isValid: false
    };
  }

  async handleSubmit(err?: Error) {
    if (!err) {
      this.props.history.goBack();
    }
  }

  render() {
    return <div className='container'>
      <h3>Nuevo producto</h3>

      <h4>¿Tienes un Excel con tus productos?</h4>
      <Button
        variant='link'
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          this.props.history.replace(Paths.CreateProductCSV());
        }}
      >
        Carga tu archivo aquí
      </Button>

      <ProductForm
        onSubmit={this.handleSubmit.bind(this)}
        isFormValid={(isValid) => {
          this.setState({ isValid });
        }}
      >
        <Button
          block
          disabled={!this.state.isValid}
          type='submit'
        >
          Crear producto
        </Button>

        <Button
          variant='secondary'
          block
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            this.props.history.goBack();
          }}
        >
          Cancelar
        </Button>
      </ProductForm>
    </div>;
  }

}

export default withRouter(hasAccountGuard(isLoggedInGuard(CreateProduct)));
