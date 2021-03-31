const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');

const {
  renderProduct,
  renderAddProductForm,
  renderRegisterForm,
  createProductId,
} = require('./helper.js');
const {
  overviewTemplate,
  formTemplate,
  productDescriptionTemplate,
  cardTemplate,
  registerFormTemplate,
} = require('./templates.js');
const {
  validateProductName,
  validateProductPrice,
  validateProductDescription,
  validateProductQuantity,
  validateProductImage,
} = require('./validator.js');
const {
  Product,
  User,
} = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(`${__dirname}/../static`));

app.get('/', async (req, res) => {
  const products = await Product.find((err, productList) => {
    if (err) {
      res.set('Content-Type', 'text/plain');
      return res.status(500)
        .send('<h2>There was an error on the server and the request could not be completed.</h2>');
    }
    return productList;
  });
  const productsTemplate = products.map((product) => renderProduct(product, cardTemplate)).join('');
  res.send(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate));
});

app.get('/product', (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
  );
  const id = Number(req.query.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404)
      .send('<h1>Product not found</h1>');
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

app.post('/register', (req, res) => {
  res.end('', 'utf-8');
});

app.get('/login', (req, res) => {
  res.end('Login', 'utf-8');
});

app.get('/add', (req, res) => {
  const template = renderAddProductForm(formTemplate);
  res.end(template, 'utf-8');
});

app.post('/add',
  validateProductName,
  validateProductImage,
  validateProductQuantity,
  validateProductPrice,
  validateProductDescription,
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
