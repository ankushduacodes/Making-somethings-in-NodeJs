const mongoose = require('mongoose');
const conn = require('../src/db');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    match: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ,.'-]+$/,
    trim: true,
    required: true,
  },
  image: {
    type: String,
    match: /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
    trim: true,
    required: true,
  },
  organic: {
    type: Boolean,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

module.exports = {
  productSchema,
};
