import * as express from "express";
import {join, resolve} from 'path';
const app = express();

const port = process.env.PORT || 3418;
console.log("Servidor corriendo en el puerto " + port);
app.listen(port);

const {config} = require('dotenv')
config()

app.use(express.urlencoded({extended:true})); 
app.use(express.json())

const publicPath = resolve(__dirname, '../public');
const staticPath = express.static(publicPath);
app.use(staticPath);

import {indexRoutes} from "./routes/indexRoutes"
app.use(indexRoutes);

app.use((req,res,next) => {
    return res.redirect("/");
})