import { Router } from 'express';
import UserController from '../Dao/controllers/usersManager.js';


const router = Router();
// Ya no interactuamos con el modelo en los endpoints, lo hacemos a través del controlador (manager)
const um = new UserController();

const auth = (req, res, next) => {
    console.log('Ejecuta el middleware de autenticación de usuario');
    next();
}



router.get('/:uid?', async (req, res) => {
    const users = await um.get(req.params.uid)
    res.status(200).json({error : null, data: users})
})

// router.post('/', auth, uploader.array('thumbnail', 3), async (req, res) => { // gestión de múltiples archivos = req.files
router.post('/', async (req, res) => { // gestión de archivo único = req.file
    const { first_name, last_name, email, password } = req.body;

    if (first_name != '' && last_name != '' && email != '' && password !='') {
        const newUser = { first_name, last_name, email, password };
        const process = await um.add(newUser);
        
        res.status(200).send({ error: null, data: process, file: req.file });
    } else {
        res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
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
        
        req.session.userData = {username : email, admin :true}
        req.flash('success', 'Usuario iniciado sesión correctamente');
        res.redirect('/')
    } catch (err) {
        res.status(500).send({ error: 'Error interno del servidor', data: err.message });
    }
});


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
