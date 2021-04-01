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
const { Product, User } = require('./db');

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
        .send('There was an error on the server and the request could not be completed.');
    }
    return productList;
  });
  const productsTemplate = products.map((product) => renderProduct(product, cardTemplate)).join('');
  return res.send(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate));
});

app.get('/product', async (req, res) => {
  const id = Number(req.query.id);
  const product = await Product.findOne({ id }, (err, fetchedProduct) => {
    if (err) {
      res.set('Content-Type', 'text/plain');
      return res.status(500)
        .send('There was an error on the server and the request could not be completed.');
    }
    return fetchedProduct;
  });

  if (!product) {
    return res.status(404)
      .send('<h1>Product not found</h1>');
  }
  const productdescTemplate = renderProduct(
    product,
    productDescriptionTemplate,
  );
  return res.end(productdescTemplate, 'utf-8');
});

app.get('/add', (req, res) => {
  const template = renderAddProductForm(formTemplate);
  return res.end(template, 'utf-8');
});

app.post('/add',
  validateProductName,
  validateProductImage,
  validateProductQuantity,
  validateProductPrice,
  validateProductDescription,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const newFormTemplate = renderAddProductForm(formTemplate, errors.mapped());
      return res.end(newFormTemplate);
    }

    const newProduct = req.body;
    newProduct.id = createProductId();
    newProduct.organic = !!newProduct.organic;

    const product = new Product(newProduct);
    // TODO add a new warning to the /add redirect if insertion of new product fails
    product.save((err, addedProduct) => {
      if (err) {
        res.end(renderAddProductForm(formTemplate), 'utf-8');
      }
      console.log(addedProduct);
    });
    return res.redirect('/');
  });

app.delete('/delete', (req, res) => {
  let products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
  );
  const id = Number(req.query.id);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404)
      .send('<h1>Product not found</h1>');
  }
  products = products.filter((item) => item !== product);
  fs.writeFileSync(
    `${__dirname}/products.json`,
    JSON.stringify(products, null, 2),
    'utf-8',
  );
  return res.send(JSON.stringify({ message: 'success' }));
});

app.get('/register', (req, res) => {
  const updatedRegisterTemplate = renderRegisterForm(registerFormTemplate);
  return res.send(updatedRegisterTemplate);
});

app.post('/register', (req, res) => res.end('', 'utf-8'));

app.get('/login', (req, res) => res.end('Login', 'utf-8'));

app.listen(port, (err) => (err
  ? console.log(err)
  : console.log(`app listening on http://localhost:${port}`)));
