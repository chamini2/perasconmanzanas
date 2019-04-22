import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Profile from './containers/Profile';
import CreateAccount from './containers/CreateAccount';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/accounts/new' exact component={CreateAccount} />
        <Route path='/profile' exact component={Profile} />
      </Switch>
      <ToastContainer autoClose={5000} hideProgressBar transition={Slide} />
    </BrowserRouter>
  );
}

export default Routes;
