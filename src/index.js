import express from "express"
import  mongoose  from "mongoose";
import handlebars from "express-handlebars"
import {Server} from "socket.io"



import routerP from "./routes/products.router.js";
import routerC from "./routes/carts.router.js";
import routerU from "./routes/users.router.js";
import routerV from "./routes/views.router.js";
import socketProducts from "./listeners/socketproducts.js";
import { config } from "./utils.js"
import { __dirname } from "./utils.js"




const app = express()



const httpServer=app.listen(config.PORT,async () => {

    await mongoose.connect(config.MONGODB_URI)



    app.use(express.static(__dirname + "/public"))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //handlebars
    app.engine("handlebars",handlebars.engine(
        {helpers: {
            multiply: (a, b) => a * b
        },
            allowProtoPropertiesByDefault: true, 
            allowProtoMethodsByDefault: true
        }
    ))
    app.set("views", __dirname+"/views")
    app.set("view engine","handlebars")
    //rutas
    // app.use("/api",routerP)
    app.use('/', routerV);

    app.use('/api/products', routerP)
    app.use('/api/carts', routerC)
    app.use('/api/users', routerU)
    
    
    console.log(`Server activo en puerto ${config.PORT}, conectado a bbdd`);
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)

