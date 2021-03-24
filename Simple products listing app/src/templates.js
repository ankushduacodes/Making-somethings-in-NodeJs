const fs = require('fs');

const overviewTemplate = fs.readFileSync(
  `${__dirname}/../templates/template-overview.html`,
  'utf-8',
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/../templates/card-template.html`,
  'utf-8',
);
const productDescriptionTemplate = fs.readFileSync(
  `${__dirname}/../templates/product-description-template.html`,
  'utf-8',
);
const formTemplate = fs.readFileSync(
  `${__dirname}/../templates/form.html`,
  'utf-8',
);

const registerFormTemplate = fs.readFileSync(`${__dirname}/../templates/register.html`, 'utf-8');

module.exports = {
  overviewTemplate,
  cardTemplate,
  productDescriptionTemplate,
  formTemplate,
  registerFormTemplate,
};
