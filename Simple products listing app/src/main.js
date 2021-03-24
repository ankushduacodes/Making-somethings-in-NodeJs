const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');
const { renderProduct, renderAddProductForm, renderRegisterForm } = require('./helper.js');
const {
  overviewTemplate,
  formTemplate,
  productDescriptionTemplate,
  cardTemplate,
  registerFormTemplate,
} = require('./templates.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(`${__dirname}/static`));

const createProductId = () => {
  const productIds = new Set(
    JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8')).map(
      (product) => product.id,
    ),
  );
  let randomId = Math.floor(Math.random() * 10000000);
  while (productIds.has(randomId)) {
    // eslint-disable-next-line max-len
    // TODO add retries to limit how many times loop fails before we tell user that product could not be added
    randomId = Math.floor(Math.random() * 10000000);
  }
  return randomId;
};

app.get('/', (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
  );
  const productsTemplate = products
    .map((product) => renderProduct(product, cardTemplate))
    .join('');
  res.send(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate));
});

app.get('/product', (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
  );
  const id = Number(req.query.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    res.status(404);
    res.end('<h1>Product not found</h1>');
  }
  const productdescTemplate = renderProduct(
    product,
    productDescriptionTemplate,
  );
  res.end(productdescTemplate, 'utf-8');
});

app.get('/register', (req, res) => {
  const updatedRegisterTemplate = renderRegisterForm(registerFormTemplate);
  res.send(updatedRegisterTemplate);
});

app.get('/add', (req, res) => {
  const template = renderAddProductForm(formTemplate);
  res.end(template, 'utf-8');
});

app.post('/add',
  check('name').notEmpty().isLength({
    min: 3,
    max: 100,
  }).escape()
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/),
  check('image').notEmpty().isLength({
    max: 1,
  }).escape()
    .matches(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/),
  check('price').notEmpty().escape().toFloat()
    .isFloat({ min: 1 }),
  check('quantity').notEmpty().escape().toInt()
    .isInt({ min: 1 }),
  check('description').notEmpty().escape().not()
    .isNumeric(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const newFormTemplate = renderAddProductForm(formTemplate, errors.mapped());
      return res.end(newFormTemplate);
    }

    const products = JSON.parse(
      fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
    );
    const newProduct = req.body;
    newProduct.id = createProductId();
    newProduct.organic = !!newProduct.organic;
    products.push(newProduct);

    fs.writeFileSync(
      `${__dirname}/products.json`,
      JSON.stringify(products, null, 2),
      'utf-8',
    );
    return res.redirect('/');
  });

app.delete('/delete', (req, res) => {
  let products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
  );
  const id = Number(req.query.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    res.status(404);
    res.end('<h1>Product not found</h1>');
  }
  products = products.filter((item) => item !== product);
  fs.writeFileSync(
    `${__dirname}/products.json`,
    JSON.stringify(products, null, 2),
    'utf-8',
  );
  res.send(JSON.stringify({ message: 'success' }));
});

app.listen(port, (err) => (err
  ? console.log(err)
  : console.log(`app listening on http://localhost:${port}`)));
