

import userModel from '../models/user.model.js';
import CartController from '../controllers/cartsManager.js'

import { createHash, isValidPassword } from '../../utils.js';


const cm = new CartController()



class UserController {
    constructor() {}

    get = async (info) => {
        try {
            // Si estás buscando por un email o algún otro campo, usa ese campo en lugar de `_id`
            const user = await userModel.findOne({ email: info }).lean(); 
    
            if (user) {
                return user;
            }
            return user
        } catch (err) {
            console.error('Error al obtener usuario(s):', err.message);
            throw new Error('No se pudo recuperar la información.');
        }
    }
    

    getOne = async (data)=>{
        try {
            return userModel.findOne(data) 
        } catch (error) {
            res.status(500).send({error, data:[]})
        }
    }
    
    
    authenticate = async (email, password) => {
        try {
            const filter = { email };
            const findUser = await userModel.findOne(filter).lean();
    
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
    
            return createdUser;
        } catch (err) {
            console.error('Error al agregar usuario:', err);
    
            if (err.code === 11000) {
                throw new Error('El correo ya está registrado. Use otro.'); // Error específico
            }
    
            throw new Error('No se pudo crear el usuario.'); // Error genérico
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
