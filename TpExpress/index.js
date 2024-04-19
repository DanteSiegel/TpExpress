import alumnosArray from "./src/models/alumno.js"
import {sumar, restar, multiplicar, dividir} from "./src/modules/matematica.js"
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from
"./src/modules/omdbwrapper.js"
import express from "express";    
import ValidacionesHelper from './src/modules/validaciones-helper.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
 res.status(200).send('¡Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => {

    res.status(200).send(`Hola ${req.params.nombre}`);

})

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {

    const { ano, mes, dia } = req.params;

    const fechaString = `${ano}-${mes}-${dia}`;

    const fechaParseada = Date.parse(fechaString);


    if (!isNaN(fechaParseada)) {

        res.status(200).send('Fecha válida');

    } else {

        res.status(400).send('Fecha inválida');

    }
});

app.get('/matematica/sumar/:n1/:n2', (req, res) => {

    const n1 = req.params.numero1;

    const n2 = req.params.numero2;

    const resultado = sumar(parseFloat(n1), parseFloat(n2));

    res.status(200).send(resultado.toString());
});

app.get('/matematica/restar/:n1/:n2', (req, res) => {

    const n1 = parseFloat(req.params.n1);

    const n2 = parseFloat(req.params.n2);

    const resultado = restar(n1, n2);

    res.status(200).send(resultado.toString());
});

app.get('/matematica/multiplicar/:n1/:n2', (req, res) => {

    const n1 = parseFloat(req.params.n1);

    const n2 = parseFloat(req.params.n2);

    const resultado = multiplicar(n1, n2);

    res.status(200).send(resultado.toString());
});

app.get('/matematica/dividir/:n1/:n2', (req, res) => {
    const n1 = parseFloat(req.params.n1);

    const n2 = parseFloat(req.params.n2);

    try {
        const resultado = dividir(n1, n2);

        res.status(200).send(resultado.toString());

    } catch (error) {

        res.status(400).send(error.message);

    }
});

app.get('/alumnos', (req, res) => {

    res.status(200).send(alumnosArray);

});

app.get('/alumnos/:dni', (req, res) => {

    const dni = req.params.dni;

    const alumno1 = alumnosArray.find(alumno => alumno.DNI === dni);
    
    if (alumno1) {
        
        res.status(200).send(alumno1);

    } else {
        res.status(404).send("Alumno no encontrado");
    }
});

app.post('/alumnos/:username/:dni/:edad', (req, res) => {
    const username1 = req.params.username;
    const dni1 = req.params.dni;
    const edad1 = req.params.edad;
    const nuevoAlumno = { username:username1, dni:dni1, edad:edad1 };
    alumnosArray.push(nuevoAlumno);
    res.status(201).send("Alumno creado correctamente.");
});

app.delete('/alumnos/:dni', (req, res) => {
    const dni = req.params.dni;
    const alumnoIndex = alumnosArray.findIndex(alumno => alumno.dni === dni);
    if (alumnoIndex !== -1) {
        alumnosArray.splice(alumnoIndex, 1);
        res.status(200).send("Alumno eliminado correctamente.");
    } else {
        res.status(404).send("Alumno no encontrado.");
    }
});

app.get('/omdb/searchbypage/:search/:page?', async (req, res) => {
    const search = req.params.search;
    const page = req.params.page;
    const result = await OMDBSearchByPage(search, page);
    res.status(200).send(result);
});

app.get('/omdb/searchcomplete/:search', async (req, res) => {
    const search = req.params.search;
    const result = await OMDBSearchComplete(search);
    res.status(200).send(result);
});

app.get('/omdb/getbyomdbid/:imdbID', async (req, res) => {
    const imdbID = req.params.imdbID;
    const result = await OMDBGetByImdbID(imdbID);
    res.status(200).send(result);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
   });

   



   app.get('/omdb/searchbypage', async (req, res) => {
     let search = ValidacionesHelper.getStringOrDefault(req.query.search, '');
     let p = ValidacionesHelper.getIntegerOrDefault(req.query.p, 1);
    
   });
   



   const express = require('express');
const DateTimeHelper = require('./src/modules/datetime-helper');




app.get('/fechas/isDate', (req, res) => {
  const { fecha } = req.query;
  if (DateTimeHelper.isDate(fecha)) {
    res.status(200).send('Fecha válida.');
  } else {
    res.status(400).send('Fecha inválida.');
  }
});


app.get('/fechas/getEdadActual', (req, res) => {
  const { fechaNacimiento } = req.query;
  const edad = DateTimeHelper.getEdadActual(fechaNacimiento);
  res.status(200).json({ edad });
});


app.get('/fechas/getDiasHastaMiCumple', (req, res) => {
  const { fechaNacimiento } = req.query;
  const diasParaCumple = DateTimeHelper.getDiasHastaMiCumple(fechaNacimiento);
  res.status(200).json({ diasParaCumple });
});


app.get('/fechas/getDiaTexto', (req, res) => {
  const { fecha, abr } = req.query;
  const retornarAbreviacion = abr === 'true';
  const diaTexto = DateTimeHelper.getDiaTexto(fecha, retornarAbreviacion);
  res.status(200).json({ dia: diaTexto });
});


app.get('/fechas/getMesTexto', (req, res) => {
  const { fecha, abr } = req.query;
  const retornarAbreviacion = abr === 'true';
  const mesTexto = DateTimeHelper.getMesTexto(fecha, retornarAbreviacion);
  res.status(200).json({ mes: mesTexto });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
