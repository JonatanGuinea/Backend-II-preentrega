import mongoose from 'mongoose';
import { config } from '../../utils.js';

mongoose.pluralize(null);

const collection = config.CARTS_COLLECTION;

const schema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: config.USERS_COLLECTION 
    },
    products: [{ 
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: config.PRODUCTS_COLLECTION 
        }, 
        quantity: { 
            type: Number, 
            required: true 
        } 
    }]
});

const model = mongoose.model(collection, schema);

export default model;



