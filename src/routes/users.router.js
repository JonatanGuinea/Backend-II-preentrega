import { Router } from 'express';
import { uploader } from '../uploader.js';
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
router.post('/', auth, async (req, res) => { // gestión de archivo único = req.file
    const { first_name, last_name, email } = req.body;

    if (first_name != '' && last_name != '' && email != '') {
        const newUser = { first_name: first_name, last_name: last_name, email: email };
        const process = await um.add(newUser);

        // Verificar resultado de process

        // const socketServer = req.app.get('socketServer');
        // socketServer.emit('new_user', newUser);
        
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


export default router;
