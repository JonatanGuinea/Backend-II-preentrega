import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';

import userManager from '../dao/users.manager.js';

import config from '../config.js';

const manager = new userManager();
const localStrategy = local.Strategy;

const initAuthStrategies = () => {
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'username'},
        async (req, username, password, done) => {
            try {
                if (username != '' && password != '') {
                    // Para simplificar el código, podemos llamar directamente al manager.authenticate(). Ver dao/users.manager.js.
                    const process = await manager.authenticate(username, password);
                    if (process) {
                        // Si el username (email) y los hash coinciden, process contendrá los datos de usuario,
                        // simplemente retornamos esos datos a través de done(), Passport los inyectará en el
                        // objeto req de Express, como req.user.
                        return done(null, process);
                    } else {
                        return done(null, false);
                        // return done('Usuario o clave no válidos', false);
                    }
                } else {
                    return done('Faltan campos: obligatorios username, password', false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('ghlogin', new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL,
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
<<<<<<< HEAD
                console.log("AccessToken:", accessToken); // Registro para verificar el token
                console.log("Profile:", profile); // Registro para depurar el perfil
    
                const email = profile.emails?.[0]?.value || profile._json.email;
    
                if (!email) {
                    return done(new Error('El perfil de GitHub no contiene un correo electrónico'), null);
=======
                console.log(profile)
                const email = profile._json?.email || null;
                
                // Necesitamos que en el profile haya un email
                // Más adelante agregaremos un control alternativo en caso
                // que el profile llegado desde Github no contenga ningún email usable
                if (email) {
                    // Tratamos de ubicar en NUESTRA base de datos un usuario
                    // con ese email, si no está lo creamos y lo devolvemos,
                    // si ya existe retornamos directamente esos datos
                    const foundUser = await manager.getOne({ email: email });

                    if (!foundUser) {
                        const user = {
                            first_name: profile._json.name.split(' ')[0],
                            last_name: profile._json.name.split(' ')[1],
                            email: email,
                            password: 'none'
                        }

                        const process = await manager.add(user);

                        return done(null, process);
                    } else {
                        return done(null, foundUser);
                    }
                }else if (email ===null ){
                    return done(new Error('Email is null'), null);
                } else {
                    return done(new Error('Faltan datos de perfil'), null);
>>>>>>> 0c0a70991c584da988a81dcf0fae33e934e6a585
                }
    
                let user = await manager.getOne({ email });
    
                if (!user) {
                    user = {
                        first_name: profile._json.name?.split(' ')[0] || 'Usuario',
                        last_name: profile._json.name?.split(' ')[1] || '',
                        email,
                        password: 'none' // No almacenar contraseñas inseguras
                    };
    
                    user = await manager.add(user);
                }
    
                return done(null, user);
            } catch (error) {
                console.error("Error en GitHubStrategy:", error); // Registro de errores
                return done(error);
            }
        }
    ));
    
    passport.serializeUser((user, done) => {
        passport.serializeUser((user, done) => {
            if (!user._id) {
                return done(new Error('El usuario no tiene un campo ID'));
            }
            done(null, user._id);
        });
        
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await manager.getOne({ _id: id });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
    
};

export default initAuthStrategies;
