import express from "express";
import alumnosArray from "./src/models/alumno.js";
import { sumar, restar, multiplicar, dividir } from "./src/modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./omdbwrapper.js";
import Alumno from "./src/models/alumno.js"; 


const app = express();
const port = 3000;


app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).send('¡Bienvenido a mi aplicación Express!');
  });
  

app.get('/saludar/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  res.status(200).send(`Hola ${nombre}`);
});

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

app.get('/matematica/sumar', (req, res) => {
  const { n1, n2 } = req.query;
  const resultado = sumar(parseFloat(n1), parseFloat(n2));
  res.status(200).send(resultado.toString());
});

app.get('/matematica/restar', (req, res) => {
  const { n1, n2 } = req.query;
  const resultado = restar(parseFloat(n1), parseFloat(n2));
  res.status(200).send(resultado.toString());
});

app.get('/matematica/multiplicar', (req, res) => {
  const { n1, n2 } = req.query;
  const resultado = multiplicar(parseFloat(n1), parseFloat(n2));
  res.status(200).send(resultado.toString());
});

app.get('/matematica/dividir', (req, res) => {
  const { n1, n2 } = req.query;
  if (parseFloat(n2) === 0) {
    res.status(400).send('El divisor no puede ser cero');
  } else {
    const resultado = dividir(parseFloat(n1), parseFloat(n2));
    res.status(200).send(resultado.toString());
  }
});


app.get('/omdb/searchbypage', async (req, res) => {
    const { search, page } = req.query;
    const result = await OMDBSearchByPage(search, page); 
    res.status(200).send(result);
  });

  app.get('/omdb/searchcomplete', async (req, res) => {
    const { search } = req.query;
    const result = await OMDBSearchComplete(search); 
    res.status(200).send(result);
  });

// Endpoint que reutiliza el módulo de clase Alumno
app.get('/alumnos', (req, res) => {
  res.status(200).send(alumnosArray);
});

app.get('/alumnos/:dni', (req, res) => {
  const dni = req.params.dni;
  const alumno = alumnosArray.find(alumno => alumno.dni === dni);
  if (alumno) {
    res.status(200).send(alumno);
  } else {
    res.status(404).send("Alumno no encontrado");
  }
});

app.post('/alumnos', (req, res) => {
    const { username, dni, edad } = req.body;
  
  
    if (!username || !dni || !edad) {
      return res.status(400).send('Todos los campos son obligatorios');
    }
  

    const existingAlumno = alumnosArray.find(alumno => alumno.dni === dni);
    if (existingAlumno) {
      return res.status(409).send('El alumno ya existe');
    }
  

    const nuevoAlumno = { username, dni, edad };
  
 
    alumnosArray.push(nuevoAlumno);
  
   
    res.status(201).send('Alumno creado correctamente');
  });
  
  
app.delete('/alumnos', (req, res) => {
    const { dni } = req.body;
    const alumnoIndex = alumnosArray.findIndex(alumno => alumno.dni === dni);
  
    if (alumnoIndex !== -1) {
      alumnosArray.splice(alumnoIndex, 1);
      res.status(200).send("Alumno eliminado correctamente.");
    } else {
      res.status(404).send("Alumno no encontrado.");
    }
  });
  
  const isDate = (fecha) => {
    const date = new Date(fecha);
    return !isNaN(date) && date instanceof Date;
  };
  

  app.get('/fechas/isDate', (req, res)  => {
    const { fecha } = req.query; 
    if (!fecha) {
      res.status(400).send('Falta el parámetro "fecha" en la URL');
      return;
    }
  
    const isValidDate = isDate(fecha);
  
    if (isValidDate) {
      res.status(200).send('Fecha válida');
    } else {
      res.status(400).send('Fecha inválida');
    }
  });
  


  app.get('/fechas/getEdadActual', (req, res) => {
    const { fechaNacimiento } = req.query;
    const dateOfBirth = new Date(fechaNacimiento);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).send('Fecha de nacimiento inválida');
    }
  
    const edadEnMilisegundos = Date.now() - dateOfBirth.getTime();
    const edadEnAnios = new Date(edadEnMilisegundos).getFullYear() - 1970;
  
    res.status(200).json({ edad: edadEnAnios });
  });
  

  app.get('/fechas/getDiasHastaMiCumple', (req, res) => {
    const { fechaNacimiento } = req.query;
    const dateOfBirth = new Date(fechaNacimiento);
    if (isNaN(dateOfBirth.getTime())) {
      return res.status(400).send('Fecha de nacimiento inválida');
    }
  
    const hoy = new Date();
    const proximoCumple = new Date(hoy.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
    if (proximoCumple < hoy) {
      proximoCumple.setFullYear(proximoCumple.getFullYear() + 1);
    }
  
    const diasHastaCumple = Math.ceil((proximoCumple - hoy) / (1000 * 60 * 60 * 24));
  
    res.status(200).json({ diasHastaCumple });
  });
  

  app.get('/fechas/getDiaTexto', (req, res) => {
    const { fecha, abr } = req.query;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return res.status(400).send('Fecha inválida');
    }
  
    const opciones = { weekday: abr ? 'short' : 'long' };
    const diaTexto = date.toLocaleDateString('es-ES', opciones);
  
    res.status(200).json({ dia: diaTexto });
  });
  

  app.get('/fechas/getMesTexto', (req, res) => {
    const { fecha, abr } = req.query;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return res.status(400).send('Fecha inválida');
    }
  
    const opciones = { month: abr ? 'short' : 'long' };
    const mesTexto = date.toLocaleDateString('es-ES', opciones);
  
    res.status(200).json({ mes: mesTexto });
  });

  
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
