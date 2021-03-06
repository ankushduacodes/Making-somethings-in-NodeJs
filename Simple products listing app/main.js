"use strict"

const express = require("express");
const fs = require("fs");
let products = require("./products")
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

app.get('/', (req, res) => {
    const productsTemplate = products.map(
        (product) => renderProduct(product, productCardTemplate)
    ).join('')
    res.end(overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, productsTemplate))
});


app.get("/product", (req, res) => {
    const id = Number(req.query.id);
    const product = products.find(product => product.id === id);
    if (!product) {
        res.status(404);
        res.end("<h1>Product not found</h1>");
    }
    const productdescTemplate = renderProduct(product, productDescriptionTemplate)
    res.end(productdescTemplate, "utf-8");
})


app.listen(port, () => console.log(`app listening on http://localhost:${port}`))
