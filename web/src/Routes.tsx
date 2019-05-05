import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Settings from './containers/Settings';
import CreateAccount from './containers/CreateAccount';
import AccountSelector from './containers/AccountSelector';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/accounts' exact component={AccountSelector} />
        <Route path='/accounts/new' exact component={CreateAccount} />
        <Route path='/settings' exact component={Settings} />
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
