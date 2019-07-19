import React, { useEffect } from 'react';
import ReactGA  from 'react-ga';
import { Location } from 'history';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { ToastContainer, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Paths from './Paths';
import Home from './containers/Home';
import Settings from './containers/Settings';
import CreateAccount from './containers/CreateAccount';
import AccountSelector from './containers/AccountSelector';
import CreateMovement from './containers/CreateMovement';
import ProductsIndex from './containers/ProductsIndex';
import PageNotFound from './containers/PageNotFound';
import ProductDetails from './containers/ProductDetails';
import MovementsIndex from './containers/MovementsIndex';
import InvitesManager from './containers/InvitesManager';
import InviteDetails from './containers/InviteDetails';
import EditProduct from './containers/EditProduct';
import { GOOGLE_ANALYTICS_KEY } from './constants';
import MovementDetails from './containers/MovementDetails';
import CreateProductCSV from './containers/CreateProductCSV';
import CreateProduct from './containers/CreateProduct';
import CreateProductTable from './containers/CreateProductTable';

const SlideTransition = cssTransition({
  enter: 'Toastify__slide-enter',
  exit: 'Toastify__slide-exit',
  duration: [180, 180],
  appendPosition: true
});

function sendPageView(location: Location) {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

function GoogleAnalyticsTracker({children, trackingId, history}: any) {
  useEffect(() => {
    ReactGA.initialize(trackingId);
    sendPageView(history.location);
    history.listen(sendPageView);
  }, []);

  return children;
}

const GATracker = withRouter(GoogleAnalyticsTracker);

function Routes() {
  return (
    <BrowserRouter>
      <GATracker trackingId={GOOGLE_ANALYTICS_KEY}>
        <Switch>
          <Route path={Paths.Home()} exact component={Home} />
          <Route path={Paths.AccountSelector()} exact component={AccountSelector} />
          <Route path={Paths.CreateAccount()} exact component={CreateAccount} />
          <Route path={Paths.ProductsIndex()} exact component={ProductsIndex} />
          <Route path={Paths.CreateProduct()} exact component={CreateProduct} />
          <Route path={Paths.CreateProductCSV()} exact component={CreateProductCSV} />
          <Route path={Paths.CreateProductTable()} exact component={CreateProductTable} />
          <Route path={Paths.EditProduct(':sku', true)} component={EditProduct} />
          <Route path={Paths.ProductDetails(':sku', undefined, true)} component={ProductDetails} />
          <Route path={Paths.ProductDetails(':sku', '*', true)} component={ProductDetails} />
          <Route path={Paths.MovementsIndex()} exact component={MovementsIndex} />
          <Route path={Paths.CreateMovement()} exact component={CreateMovement} />
          <Route path={Paths.MovementDetails(':id', undefined, true)} exact component={MovementDetails} />
          <Route path={Paths.MovementDetails(':id', '*', true)} exact component={MovementDetails} />
          <Route path={Paths.Invites()} exact component={InvitesManager} />
          <Route path={Paths.InviteDetails(':account', ':code', true)} exact component={InviteDetails} />
          <Route path={Paths.Settings()} exact component={Settings} />
          <Route component={PageNotFound} />
        </Switch>
      </GATracker>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        // transition={SlideTransition}
      />
    </BrowserRouter>
  );
}

export default Routes;
