const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(`${__dirname}/static`));

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/card-template.html`,
  'utf-8',
);
const productDescriptionTemplate = fs.readFileSync(
  `${__dirname}/templates/product-description-template.html`,
  'utf-8',
);
const formTemplate = fs.readFileSync(
  `${__dirname}/templates/form.html`,
  'utf-8',
);

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

function renderForm(productFormTemplate, errors = undefined) {
  if (!errors) {
    return productFormTemplate;
  }
  return undefined;
}

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

app.get('/add', (req, res) => {
  const template = renderForm(formTemplate);
  res.end(template, 'utf-8');
});

app.post('/add',
  // sanitizeParam(['name', 'image', 'quantity', 'price', 'description']),
  check('name').notEmpty().isLength({
    min: 5,
    max: 100,
  }).escape()
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/)
    .withMessage('Name must be of 5 letters minimum and must be valid'),
  check('image').notEmpty().isLength({
    min: 1,
    max: 1,
  }).escape()
    .matches(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)
    .withMessage('Please add any one emoji here'),
  check('price').notEmpty().escape().toFloat()
    .withMessage('Please enter a valid value'),
  check('quantity').notEmpty().escape().toInt()
    .withMessage('Entered quantity was not valid'),
  check('description').notEmpty().escape().withMessage('Please enter a valid description of the product'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // TODO show errors to client
      return res.end(JSON.stringify(errors), 'utf-8');
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
