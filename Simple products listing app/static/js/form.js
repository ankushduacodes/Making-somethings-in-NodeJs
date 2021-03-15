// TODO: add client side validation

const submitBtn = document.getElementById('submit-button');
const form = document.getElementById('post-form');

const addInvalid = (element) => {
  if (!element.className.includes('invalid')) {
    // eslint-disable-next-line no-param-reassign
    element.className += 'invalid';
  }
  return element;
};

// eslint-disable-next-line consistent-return
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = document.getElementById('product-name');
  const productImage = document.getElementById('product-image');
  const productQuantity = document.getElementById('product-quantity');
  const productPrice = document.getElementById('product-price');
  const productDescription = document.getElementById('product-desc');

  const namePattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  if (!productName.value.length >= 10 || productName !== productName.value.match(namePattern)) {
    addInvalid(productName);
  } else {
    form.submit();
  }
});
