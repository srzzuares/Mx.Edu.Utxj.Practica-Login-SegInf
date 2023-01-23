const express = require("express");
//gestiona las sesiones
const session = require("express-session");
const { path } = require("express/lib/application");
const { render } = require("express/lib/response");
// 
require("dotenv").config()

//extraer llaves secretas
const KEY_SECRET = process.env.KEY_SECRET

const app = express();
app.use(express.static("public"))

//crear nueva sesion 
const currentSession = new session.MemoryStore()

//Midlewares
const protectRoute = (req, res, next) => {
    // revisar si el usaurioes autenticado
    const { auntheticated } = req.session

    if (!auntheticated) {
        res.sendStatus(401)
    } else {
        next()
    }
}

//

app.use(session({
    secret: KEY_SECRET,
    resave: false,
    saveUninitialized: true,
    currentSession
}))  



const Port = 3000
app.listen(Port, () => {
    console.log("Server Running " + Port)
})



/* 3 rutas get :LOGIN , LOGOUT, USERS */

// GENEQRATE USER SESION
app.post('/login', (req, res) => { 
    const { auntheticated } = req.session
    if (!auntheticated){
        req.session.auntheticated= true 
        res.json({
            mensaje:"Estas Adentro"
        })
        
    }else{
        res.json({
            mensaje:"No Se pudo entrar"
        })
    }
})

// DELETE USER SESION
app.get('/logout', (req, res) => { 
    req.session.destroy(()=>{
        res.json ({ mensaje: "Te fuiste Terricola"})
    })
})

// PROTECTED ROUTE
app.get('/users', protectRoute,(req, res) => {
    res.json([
        { id: 1, username: "cssuar", createdAt:new Date()},
        { id: 2, username: "uriel", createdAt:new Date()},
        { id: 3, username: "dedos", createdAt:new Date()}
    ])
})

app.get('/', (req, res) => {
    const { nombre = "Anonimo" } = req.query
    /* Alt-96 Comillas alrevez */
    res.json({
        mensaje: `Bienvenido Terricola  ${nombre}`,
        token: KEY_SECRET
    })
})