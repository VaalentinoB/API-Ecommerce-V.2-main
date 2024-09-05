//Conexion con Mongoose

import mongoose from "mongoose";


mongoose.connect("mongodb+srv://valentinoburioni:vburioni1234@apivb.vym0xct.mongodb.net/eccomerce",)
    .then(() => {
        console.log('Conectado a la base de datos');
    }).catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });
