// TODO: add client side validation

const form = document.getElementById('post-form');

const addInvalidClass = (element) => {
  if (!element.className.includes('invalid')) {
    // eslint-disable-next-line no-param-reassign
    element.className += 'invalid';
  }
};

const removeInvalidClass = (element) => {
  if (element.className.includes('invalid')) {
    // eslint-disable-next-line no-param-reassign
    element.className -= 'invalid';
  }
};

function validatedName(productName) {
  const namePattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/u;
  if (!productName.value.length >= 10 || productName !== productName.value.match(namePattern)) {
    addInvalidClass(productName);
    return true;
  }
  removeInvalidClass(productName);
  return false;
}

function validatedImage(productImage) {
  return true;
}

function validatedQuantity(productQuantity) {
  return true;
}

function validatedPrice(productPrice) {
  return true;
}

function validatedDescription(productDescription) {
  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = document.getElementById('product-name');
  const productImage = document.getElementById('product-image');
  const productQuantity = document.getElementById('product-quantity');
  const productPrice = document.getElementById('product-price');
  const productDescription = document.getElementById('product-desc');
  if (validatedName(productName)
    && validatedImage(productImage)
    && validatedQuantity(productQuantity)
    && validatedPrice(productPrice)
    && validatedDescription(productDescription)) {
    form.submit();
  }
});
