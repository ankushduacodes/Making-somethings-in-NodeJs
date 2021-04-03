const express = require('express');
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
  try {
    // TODO add a message saying no products were found if fetched 0 products from the database
    const products = await Product.find();
    const productsTemplate = products.map((product) => renderProduct(product, cardTemplate)).join('');
    // eslint-disable-next-line max-len
    // TODO do something about status number match if 201 is sent then in delete.js should recognise it as success
    return res.status(200).send(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate));
  } catch (err) {
    return res.status(500)
      .send('There was an error on the server and the request could not be completed.');
  }
});

app.get('/product', async (req, res) => {
  const id = Number(req.query.id);
  let product;
  try {
    product = await Product.findOne({ id });
  } catch (err) {
    return res.status(500)
      .send('There was an error on the server and the request could not be completed.');
  }

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
      return res.end(newFormTemplate, 'utf-8');
    }

    const newProduct = req.body;
    newProduct.id = createProductId();
    newProduct.organic = !!newProduct.organic;
    const product = new Product(newProduct);
    try {
      await product.save();
      return res.status(201).redirect('/');
    } catch (err) {
      // TODO add a new warning to the /add redirect if insertion of new product fails
      return res.status(500).send(renderAddProductForm(formTemplate));
    }
  });

app.delete('/delete', async (req, res) => {
  const id = Number(req.query.id);
  try {
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deletion success' });
  } catch (err) {
    return res.status(404).json({ message: 'Product not found' });
  }
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
