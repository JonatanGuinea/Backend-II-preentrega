

import passport from 'passport';
import local from 'passport-local';

import userController from '../Dao/controllers/usersManager.js';

const manager = new userController();
const localStrategy = local.Strategy;

const initAuthStrategies = () => {
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                if (username != '' && password != '') {
                    

                    const process = await manager.authenticate(username, password);

                    if (process) {
                        
                        return done(null, process);

                    } else {
                        return done('Usuario o clave no válidos', false);
                    }
                } else {
                    return done('Faltan campos: obligatorios username, password', false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

export default initAuthStrategies;
