import { Router } from 'express';
import passport from 'passport';
import initAuthStrategies from '../auth/passport.config.js'

import UserController from "../Dao/controllers/usersManager.js"
import { createToken } from '../utils.js';




const router = Router();

const um = new UserController();
initAuthStrategies()

const auth = (req, res, next) => {
    if(req.session?.passport) {
        next();

    }else {
        res.status(401).send({error:'no autorizado', data:[]})
    }
}

const existUser = async (req, res, next)=>{
    const {email} = req.body
    const dexist = await um.getOne({email})

    if(dexist){
       return res.status(401).send({error:'El email se encuentra registrado', data :[]})
    }else {
        next()
    }
}



// router.get('/:uid?', async (req, res) => {
//     const users = await um.get(req.params.uid)
//     res.status(200).json({error : null, data: 'jo'})
// })


router.post('/', existUser, async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validación de campos
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
        }

        const newUser = { first_name, last_name, email, password };

        // Intentar agregar el usuario
        const createdUser = await um.add(newUser);
        res.status(201).send({ error: null, data: createdUser });
    } catch (error) {
        console.error('Error en la creación de usuario:', error.message);

        // Verificar el tipo de error
        if (error.message === 'El correo ya está registrado. Use otro.') {
            return res.status(400).send({ error: error.message, data: [] });
        }

        // Error genérico
        res.status(500).send({ error: 'Error interno del servidor', data: [] });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;
    const filter = { _id: id };
    const updated = { first_name: first_name, last_name: last_name, email: email };
    const options = { new: true };

    const process = await um.update(filter, updated, options);
    
    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const filter = { _id: id };
    const options = {};

    const process = await um.delete(filter, options);
    
    if (process) {
        res.status(200).send({ error: null, data: 'Usuario borrado' });
    } else {
        res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Faltan datos obligatorios', data: null });
        }

        const verify = await um.authenticate(email, password);

        if (verify === 'Usuario no encontrado') {
            return res.status(404).send({ error: verify, data: null });
        }
        
        req.session.userData = {first_name :verify.first_name  ,last_name :verify.las_name ,email : verify.email, admin :true}
        req.flash('success', 'Usuario iniciado sesión correctamente');
        res.redirect('/');
    } catch (err) {
        res.status(500).send({ error: 'Error interno del servidor', data: err.message });
    }
});

router.post('/pplogin', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.session.userData = req.user;
    req.session.save(err => {
        if (err) {
            return res.status(500).send({ error: 'Error al almacenar la sesión', data: [] });
        }
        res.redirect('/');
    });
});



router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});


router.get('/ghcallback', passport.authenticate('ghlogin', { failureRedirect: '/' }), async (req, res) => {
    try {
        console.log("Usuario autenticado con GitHub:", req.user);
        req.session.userData = req.user;
        res.redirect('/');
    } catch (err) {
        console.error("Error en GitHub Callback:", err);
        res.status(500).send({ error: "Error al procesar el inicio de sesión con GitHub", data: [] });
    }
});




router.post('jwtlogin', async(req, res)=>{
    const {email, password}=req.body;

    if(email!='' && password !=''){
        const process = await um.authenticate(email, password);

        if(process){
            const payload= {email, admin:true};
            const token = createToken(payload, '1h')

            res.status(200).send({error: null, data:{autentication: 'ok', token: token}})
        }else {
            res.status(401).send({error:'Usuario o clave no válidos JWT', data:[]})
        }
    }else{
        res.status(400).send({error:'Faltan campos obligatorios , email y password', data:[]})
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res.status(500).send({ error: "Error al cerrar sesión", data: [] });
        }
        res.status(200).send({ error: null, data: "Sesión cerrada" });
    });
});






export default router;
