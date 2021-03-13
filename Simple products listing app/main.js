"use strict"

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express()
const port = 3000;

app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + "/static"))

const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const productCardTemplate = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8')
const productDescriptionTemplate = fs.readFileSync(`${__dirname}/templates/product-description-template.html`, 'utf-8')

function renderProduct(product, productCardTemplate) {
    let output = productCardTemplate.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%NAME%}/g, product.name)
    output = output.replace(/{%ORGANIC%}/g, product.organic)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    return output;
}

const createProductId = () => {
    const productIds = new Set(
        JSON.parse(
            fs.readFileSync(
                `${__dirname}/products.json`, 'utf-8'
            )).map(product => product.id)
    );
    let randomId = Math.floor(Math.random() * 10000000)
    while(productIds.has(randomId)) {
        // add retries to limit how many times loop fails before we tell user that product could not be added
        randomId = Math.floor(Math.random() * 10000000)
    }
    return randomId;
}

app.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const productsTemplate = products.map(
        (product) => renderProduct(product, productCardTemplate)
    ).join('')
    res.send(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate))
});


app.get("/product", (req, res) => {
    const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const id = Number(req.query.id);
    const product = products.find(product => product.id === id);
    if (!product) {
        res.status(404);
        res.end("<h1>Product not found</h1>");
    }
    const productdescTemplate = renderProduct(product, productDescriptionTemplate)
    res.end(productdescTemplate, "utf-8");
})

// TODO: add server side validations
app.get("/add", (req, res) => {
    res.sendFile(`${__dirname}/templates/form.html`);
})

app.post("/add", (req, res) => {
    const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const newProduct = req.body;
    newProduct.id = createProductId();
    newProduct.organic = !newProduct.organic ? false : true;
    products.push(newProduct);
    fs.writeFileSync(`${__dirname}/products.json`, JSON.stringify(products, null, 2), 'utf-8')
    res.redirect('/');
})

app.delete("/delete", (req, res) => {
    let products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const id = Number(req.query.id);
    const product = products.find(product => product.id === id);
    if (!product) {
        res.status(404);
        res.end("<h1>Product not found</h1>");
    }
    products = products.filter(item => item !== product);
    fs.writeFileSync(`${__dirname}/products.json`, JSON.stringify(products, null, 2), 'utf-8')
    res.send(JSON.stringify({'message': 'success'}));
})

app.listen(port, err => err ? console.log(err) : console.log(`app listening on http://localhost:${port}`))
