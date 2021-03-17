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
  if (productName.value.length < 3
    || !productName.value.match(namePattern)?.includes(productName.value)) {
    addInvalidClass(productName);
    return false;
  }
  removeInvalidClass(productName);
  return true;
}

function validatedImage(productImage) {
  const emojiPattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
  if (!productImage.value
    || !productImage.value.match(emojiPattern)?.includes(productImage.value)) {
    addInvalidClass(productImage);
    return false;
  }
  removeInvalidClass(productImage);
  return true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const productName = document.getElementById('product-name');
  const productImage = document.getElementById('product-image');

  if (validatedName(productName)
    && validatedImage(productImage)) {
    form.submit();
  }
});
