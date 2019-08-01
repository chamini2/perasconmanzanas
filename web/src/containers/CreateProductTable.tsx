import React, { Component } from 'react';
import isLoggedInGuard from '../wrappers/isLoggedInGuard';
import withAuthInfo, { AuthInfoProps } from '../wrappers/withAuthInfo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import toNumber from 'lodash/toNumber';
import { Product } from '../services/ProductsService';
import hasAccountGuard from '../wrappers/hasAccountGuard';
import Table from 'react-bootstrap/Table';
import ProductForm from './ProductForm';
import Button from 'react-bootstrap/Button';
import Paths from '../Paths';
import { Movement } from '../services/MovementsService';

interface State {
  products: {
    sku: Product['sku'];
    description: Product['sku'];
    initial_stock?: Movement['quantity'];
    hidden: boolean;
    readOnly: boolean;
    ref: React.RefObject<HTMLTableRowElement>
  }[];
}

interface Props {
  data?: string[][];
}

class CreateProductTable extends Component<RouteComponentProps & AuthInfoProps & Props, State> {

  constructor(props: CreateProductTable['props']) {
    super(props);

    const {
      data
    } = props;

    const rows: string[][] = data || [];

    this.state = {
      products: rows.map((row) =>
        ({
          sku: row[0],
          description: row[1],
          initial_stock: toNumber(row[2]) || 0,
          hidden: false,
          readOnly: false,
          ref: React.createRef()
        })
      )
    };
  }

  render() {
    const {
      products
    } = this.state;

    return <div className='container CreateProductTable'>
      <h3>Nuevos Productos</h3>

      <Table variant='none'>
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          {
            products.map((product, i) =>
              <tr ref={product.ref} key={i}>
                <td>
                  {
                    product.hidden
                      ? <Button
                          variant='link' onClick={(event: React.MouseEvent) => {
                            event.stopPropagation();
                            products[i].hidden = false;
                            this.setState({
                              products
                            });
                        }}
                        >
                          Mostrar
                        </Button>
                      : <ProductForm
                          product={{...product}}
                          isFormValid={() => {}}
                          readOnly={product.readOnly}
                          onSubmit={(err) => {
                            if (!err) {
                              products[i].hidden = true;
                              products[i].readOnly = true;
                              this.setState({
                                products
                              });

                              window.scrollBy(0, product.ref.current!.offsetHeight);
                            }
                          }}
                        >
                          {
                            product.readOnly
                              ? null
                              : <Button block type='submit'>
                                  Crear producto
                                </Button>
                          }

                          <Button
                            variant='outline-danger'
                            block
                            onClick={(event: React.MouseEvent) => {
                              event.stopPropagation();
                              products[i].hidden = true;
                              this.setState({
                                products
                              });
                            }}
                          >
                            Descartar producto
                          </Button>
                        </ProductForm>
                  }
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>

      <Button
        block
        href={Paths.ProductsIndex()}
        variant='outline-success'
      >
        Continuar
      </Button>
    </div>;
  }

}

export default withRouter(withAuthInfo(hasAccountGuard(isLoggedInGuard(CreateProductTable))));
