const { check } = require('express-validator');

const validateProductName = check('name').notEmpty().isLength({
  min: 3,
  max: 100,
}).escape()
  .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/);

const validateProductImage = check('image').notEmpty().isLength({
  max: 1,
}).escape()
  .matches(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/);

const validateProductQuantity = check('quantity').notEmpty().escape().toInt()
  .isInt({ min: 1 });

const validateProductPrice = check('price').notEmpty().escape().toFloat()
  .isFloat({ min: 1 });

const validateProductDescription = check('description').notEmpty().escape().not()
  .isNumeric();

module.exports = {
  validateProductName,
  validateProductImage,
  validateProductQuantity,
  validateProductPrice,
  validateProductDescription,
};
