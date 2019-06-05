import isUndefined from 'lodash/isUndefined';

export function Home(path?: string) {
  if (isUndefined(path)) {
    return '/';
  } else {
    return '/?back=' + encodeURIComponent(path);
  }
}

export function AccountSelector(path?: string) {
  if (isUndefined(path)) {
    return '/accounts';
  } else {
    return '/accounts?back=' + encodeURIComponent(path);
  }
}

export function CreateAccount() {
  return '/accounts/new';
}

export function ProductsIndex() {
  return '/products';
}

export function CreateProduct() {
  return '/products/new';
}

export function ProductDetails(sku: string, description?: string) {
  if (description) {
    return `/products/${sku}/${description}`;
  } else {
    return `/products/${sku}`;
  }
}

export function MovementsIndex() {
  return '/movements';
}

export function CreateMovement() {
  return '/movements/new';
}

export function Settings() {
  return '/settings';
}

export function PageNotFound() {
  return '/404';
}
