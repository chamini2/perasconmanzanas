export function Home() {
  return '/';
}

export function AccountSelector() {
  return '/accounts';
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

export function CreateMovement() {
  return '/movements/new';
}

export function Settings() {
  return '/settings';
}

export function PageNotFound() {
  return '/404';
}
