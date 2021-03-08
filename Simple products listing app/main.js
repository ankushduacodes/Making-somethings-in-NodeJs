"use strict"

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express()
const port = 3000;

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

const getProductId = () => {
    const randomId = Math.floor(Math.random() * 10000)
    const productIds = new Set(
        JSON.parse(
            fs.readFileSync(
                `${__dirname}/products.json`, 'utf-8'
            )).map(product => product.id)
    );
    if (productIds.has(randomId)) {
        getProductId()
    }
    productIds.add(randomId);
    return randomId;
}

app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const productsTemplate = products.map(
        (product) => renderProduct(product, productCardTemplate)
    ).join('')
    res.end(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate))
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

app.get("/add", (req, res) => {
    res.sendFile(`${__dirname}/templates/form.html`);
})

app.post("/add", (req, res) => {
    const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
    const newProduct = req.body;
    newProduct.id = getProductId();
    newProduct.organic = !newProduct.organic ? false : true;
    products.push(newProduct);
    fs.writeFileSync(`${__dirname}/products.json`, JSON.stringify(products), 'utf-8')
    res.redirect('/');
})


app.listen(port, () => console.log(`app listening on http://localhost:${port}`))
