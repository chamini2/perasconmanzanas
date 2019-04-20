import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Home from './containers/Home';
import Profile from './containers/Profile';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function Routes() {
  return (
    <BrowserRouter>
      <Route path='/' exact component={Home} />
      <Route path='/profile' exact component={Profile} />
      <ToastContainer autoClose={5000} hideProgressBar transition={Slide} />
    </BrowserRouter>
  );
}

export default Routes;
