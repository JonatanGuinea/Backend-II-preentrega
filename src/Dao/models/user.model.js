import mongoose from 'mongoose';
import {config} from '../../utils.js';

mongoose.pluralize(null);

const collection = config.USERS_COLLECTION;

const schema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String }
    // password: { type: String, required: true }
});

const model = mongoose.model(collection, schema);
// Aplica el plugin de paginación antes de crear el modelo



export default model;
