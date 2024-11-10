

import userModel from '../models/user.model.js';
import CartController from '../controllers/cartsManager.js'

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

    add = async (data) => {
        try {
            const createdUser = await userModel.create(data)
            
            const infoToCart = {userId : createdUser._id , products:[]}

            cm.add(infoToCart)
            
            return createdUser
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
