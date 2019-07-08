import isUndefined from 'lodash/isUndefined';
import { Product } from './services/ProductsService';
import { Invite } from './services/InvitesService';
import { Movement } from './services/MovementsService';

function rawCheck(value: string, raw: boolean) {
  return raw ? value : encodeURIComponent(value)
}

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

  ProductDetails(sku: Product['sku'], description?: Product['description'], raw: boolean = false) {
    const base = '/products/' + rawCheck(sku, raw);
    if (isUndefined(description)) {
      return base;
    } else {
      return base + '/' + rawCheck(description, raw);
    }
  },

  EditProduct(sku: Product['sku'], raw: boolean = false) {
    return '/products/' + rawCheck(sku, raw) + '/edit';
  },

  MovementsIndex() {
    return '/movements';
  },

  CreateMovement(sku?: Product['sku']) {
    const base = '/movements/new';
    if (isUndefined(sku)) {
      return base;
    } else {
      return base + '?sku=' + encodeURIComponent(sku);
    }
  },

  MovementDetails(id: Movement['id'], description?: Product['description'], raw: boolean = false) {
    const base = '/movements/' + rawCheck(id, raw);
    if (isUndefined(description)) {
      return base;
    } else {
      return base + '/' + rawCheck(description, raw);
    }
  },

  Members() {
    return '/members';
  },

  Invites() {
    return '/invites';
  },

  InviteDetails(account: Account['id'], code: Invite['id'], raw: boolean = false) {
    return '/invites/' + rawCheck(account, raw) + '/' + rawCheck(code, raw);
  },

  Settings() {
    return '/settings';
  }

}
