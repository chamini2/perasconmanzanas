import isUndefined from 'lodash/isUndefined';
import { Product } from './services/ProductsService';
import { Invite } from './services/InvitesService';

export default {
  Home(path?: string) {
    const base = '/';
    if (isUndefined(path)) {
      return base;
    } else {
      return base + '?back=' + encodeURIComponent(path);
    }
  },

  AccountSelector(path?: string) {
    const base = '/accounts';
    if (isUndefined(path)) {
      return base;
    } else {
      return base + '?back=' + encodeURIComponent(path);
    }
  },

  CreateAccount() {
    return '/accounts/new';
  },

  ProductsIndex() {
    return '/products';
  },

  CreateProduct() {
    return '/products/new';
  },

  ProductDetails(sku: Product['sku'], description?: Product['description']) {
    const base = '/products/' + sku;
    if (isUndefined(description)) {
      return base;
    } else {
      return base + '/' + description;
    }
  },

  MovementsIndex() {
    return '/movements';
  },

  CreateMovement(sku?: Product['sku']) {
    const base = '/movements/new';
    if (isUndefined(sku)) {
      return base;
    } else {
      return base + '?sku=' + sku;
    }
  },

  Members() {
    return '/members';
  },

  Invites() {
    return '/invites';
  },

  InviteDetails(account: Account['id'], code: Invite['id']) {
    return '/invites/' + account + '/' + code;
  },

  Settings() {
    return '/settings';
  },

  PageNotFound() {
    return '/404';
  }
}
