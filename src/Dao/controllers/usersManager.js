

import userModel from '../models/user.model.js';
import CartController from '../controllers/cartsManager.js'

import { createHash, isValidPassword } from '../../utils.js';


const cm = new CartController()



class UserController {
    constructor() {}

    get = async (info) => {
        try {
            if (info) {
                const userid = await userModel.findById(info).select('-password').lean();
                return userid || 'Usuario no encontrado';
            }
            return await userModel.find().select('-password').lean();
        } catch (err) {
            console.error('Error al obtener usuario(s):', err);
            throw new Error('No se pudo recuperar la información.');
        }
    };
    
    
    authenticate = async (email, password) => {
        try {
            const filter = { email };
            const findUser = await userModel.findOne(filter);
    
            if (!findUser) {
                return 'Usuario no encontrado';
            }
    
            const validPass = isValidPassword(password, findUser.password);
    
            return validPass ? findUser : 'Contraseña incorrecta';
        } catch (err) {
            return err.message;
        }
    };
    

    add = async (data) => {
        try {
            data.password = createHash(data.password);
            const createdUser = await userModel.create(data);
    
            const infoToCart = await cm.add(createdUser._id);
    
            return infoToCart;
        } catch (err) {
            console.error('Error al agregar usuario:', err);
            throw new Error('No se pudo crear el usuario.');
        }
    };
    

    update = async (filter, updated, options) => {
        try {
            return await userModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await userModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message;
        }
    }
}


export default UserController;
