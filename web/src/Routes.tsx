import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './containers/Home';
import Settings from './containers/Settings';
import CreateAccount from './containers/CreateAccount';
import AccountSelector from './containers/AccountSelector';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CreateMovement from './containers/CreateMovement';
import ProductsIndex from './containers/ProductsIndex';
import CreateProduct from './containers/CreateProduct';
import PageNotFound from './containers/PageNotFound';
import ProductDetails from './containers/ProductDetails';
import * as Paths from './Paths';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={Paths.Home()} exact component={Home} />
        <Route path={Paths.AccountSelector()} exact component={AccountSelector} />
        <Route path={Paths.CreateAccount()} exact component={CreateAccount} />
        <Route path={Paths.ProductsIndex()} exact component={ProductsIndex} />
        <Route path={Paths.CreateProduct()} exact component={CreateProduct} />
        <Route path={Paths.ProductDetails(':sku')} component={ProductDetails} />
        <Route path={Paths.ProductDetails(':sku', '*')} component={ProductDetails} />
        <Route path={Paths.CreateMovement()} exact component={CreateMovement} />
        <Route path={Paths.Settings()} exact component={Settings} />
        <Route path={Paths.PageNotFound()} exact component={PageNotFound} />
        <Redirect to={Paths.PageNotFound()} />
      </Switch>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        transition={Slide}
      />
    </BrowserRouter>
  );
}

export default Routes;
