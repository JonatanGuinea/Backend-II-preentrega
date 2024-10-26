import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import { config } from "./utils.js"
import routerP from "./routes/products.router.js";
import routerV from "./routes/views.router.js";
import socketProducts from "./listeners/socketproducts.js";
import  mongoose  from "mongoose";


const app = express()

app.use(express.static(__dirname + "/public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")
//rutas
app.use("/api",routerP)
app.use('/', routerV);


const httpServer=app.listen(config.PORT,async () => {

    await mongoose.connect(config.MONGODB_URI)

    console.log(`Server activo en puerto ${config.PORT}, conectado a bbdd`);
    
    
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)