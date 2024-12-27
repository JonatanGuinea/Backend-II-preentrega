

import userModel from '../models/user.model.js';
import CartController from '../controllers/cartsManager.js'

import { createHash, isValidPassword } from '../../utils.js';


const cm = new CartController()



class UserController {
    constructor() {}

    get = async (info) => {
        try {
            const userid = await userModel.findById(info).lean()

            
            if(userid){
                return userid
            }
            return await userModel.find().lean();
            
        } catch (err) {
            
            
            return err.message;
        }
    }
    authenticate = async (email, password) => {
        try {
            // const filter = { email, password };
            const filter = { email };
            const findUser = await userModel.findOne(filter);

            const validPass = isValidPassword(password, findUser.password)
    
            return validPass ? findUser : 'Usuario no encontrado';
        } catch (err) {
            return err.message;
        }
    };

    add = async (data) => {
        try {

            data.password = createHash(data.password)
            const createdUser = await userModel.create(data)
            
            const infoToCart = await cm.add(createdUser._id)

            return infoToCart
            
        } catch (err) {
            
            return err.message;
        }
    }

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
