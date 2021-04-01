/* This file contains all the helper functions */

const createProductId = () => Math.floor(Math.random() * 10000000);

function renderProduct(product, productCardTemplate) {
  let output = productCardTemplate.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%NAME%}/g, product.name);
  output = output.replace(/{%ORGANIC%}/g, product.organic);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  return output;
}

function renderAddProductForm(productFormTemplate, errors = undefined) {
  const descriptionError = 'Please enter a valid description of the product';
  const imageError = 'Please add any one emoji here';
  const priceError = 'Please enter a valid value';
  const nameError = 'Name must be of 3 letters minimum and must be valid alphabets';
  const quantityError = 'Entered quantity was not valid';

  let output = productFormTemplate.replace(/{%NAME%}/g, errors?.name ? nameError : '');
  output = output.replace(/{%IMAGE%}/g, errors?.image ? imageError : '');
  output = output.replace(/{%PRICE%}/g, errors?.price ? priceError : '');
  output = output.replace(/{%QUANTITY%}/g, errors?.quantity ? quantityError : '');
  output = output.replace(/{%DESCRIPTION%}/g, errors?.description ? descriptionError : '');
  return output;
}

// eslint-disable-next-line no-unused-vars
function renderRegisterForm(registerFormTemplate, errors = undefined) {
  const usernameError = '';
  const emailError = '';
  const passwordError = '';
  const confirmPasswordError = '';

  let output = registerFormTemplate.replace(/{%USERNAME%}/g, errors?.username ? usernameError : '');
  output = output.replace(/{%EMAIL%}/g, errors?.email ? emailError : '');
  output = output.replace(/{%PASSWORD%}/g, errors?.password ? passwordError : '');
  output = output.replace(/{%CONFIRM_PASSWORD%}/g, errors?.conform_password ? confirmPasswordError : '');
  return output;
}

module.exports = {
  renderProduct,
  renderAddProductForm,
  renderRegisterForm,
  createProductId,
};
