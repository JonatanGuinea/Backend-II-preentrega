import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from 'cors'

import routerP from "./routes/products.router.js";
import routerC from "./routes/carts.router.js";
import routerU from "./routes/users.router.js";
import routerV from "./routes/views.router.js";
import socketProducts from "./listeners/socketproducts.js";
import { config, __dirname } from "./utils.js";
import initAuthStrategies from "./auth/passport.config.js";

const app = express();

const httpServer = app.listen(config.PORT, async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Conexión a MongoDB exitosa.");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }

    // Configuración de middleware
    app.use(express.static(__dirname + "/public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(session({
        secret: config.SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: config.MONGODB_URI,
            ttl: 60, 
            mongoOptions: {}
        })
    }));

    app.use(cors({origin:'*'}))

    // Inicializar Passport y estrategias
    initAuthStrategies();
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    // Configuración de Handlebars
    app.engine("handlebars", handlebars.engine({
        helpers: {
            multiply: (a, b) => a * b
        },
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }));

    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");

    // Rutas
    app.use('/', routerV);
    app.use('/api/products', routerP);
    app.use('/api/carts', routerC);
    app.use('/api/users', routerU);

    console.log(`Servidor activo en puerto ${config.PORT}, conectado a la base de datos.`);
});

// Configuración de Socket.io
const socketServer = new Server(httpServer);
socketProducts(socketServer);


