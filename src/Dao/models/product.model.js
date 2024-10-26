import mongoose  from 'mongoose';
mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  }
});

const model = mongoose.model(collection, schema);

export default model;
