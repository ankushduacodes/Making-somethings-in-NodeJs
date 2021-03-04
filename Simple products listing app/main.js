"use strict"

const express = require("express");
const fs = require("fs");
const products = require("./products")
const app = express()
const port = 3000;

const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`)
const productCardTemplate = fs.readFileSync(`${__dirname}/templates/card-template.html`)
const productDescriptionTemplate = fs.readFileSync(`${__dirname}/templates/product-description-template.html`)

app.get('/', (req, res) => {
    res.end("hello")
});


app.get("/product", (req, res) => {
    const id = parseInt(req.query.id, 10);
    const product = products.find(product => product.id === id);
    if (!product) {
        res.status(404);
        res.end("<h1>Product not found</h1>");
    }
    res.send(product);
})


app.listen(port, () => console.log(`app listening on http://localhost:${port}`))
