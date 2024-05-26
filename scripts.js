import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, push, set, get } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';


// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCW9-0b_cOtIR0cZd68qyvJw3k8oBuwf2U",
    authDomain: "asistencia-24d4f.firebaseapp.com",
    databaseURL: "https://asistencia-24d4f-default-rtdb.firebaseio.com",
    projectId: "asistencia-24d4f",
    storageBucket: "asistencia-24d4f.appspot.com",
    messagingSenderId: "280832142525",
    appId: "1:280832142525:web:8ce3ef23e0379eb04c1bd4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Referencia a la base de datos
const db = getDatabase(app);

// Obtener la referencia a la colección de estudiantes
const estudiantesRef =  ref(db, 'estudiantes');

// Agregar evento al formulario para cargar datos
document.getElementById('dataForm').addEventListener('submit', cargarDatosDesdeCSV);



// Obtener el número de registros en la colección
async function obtenerCantidadRegistros() {
    try {
        const snapshot = await get(estudiantesRef);
        if (snapshot.exists()) {
            const valorTemp = Object.keys(snapshot.val()).length;
            const cantidadRegistros = (valorTemp + 1).toString();
            console.log('Cantidad de registros:', cantidadRegistros); 
            return cantidadRegistros;
        } else {
            console.log('No hay registros en la colección.');
            return 0;
        }
    } catch (error) {
        console.error('Error al obtener la cantidad de registros:', error);
        return -1; // O cualquier otro valor que indique un error
    }
}


// Función para cargar datos
async function cargarDatos(event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    try {
        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const curso = parseInt(document.getElementById('curso').value);

        // Obtener una referencia a la colección de estudiantes
        const db = getDatabase();
        const estudiantesRef = ref(db, 'estudiantes');

        // Generar una nueva clave única para el registro utilizando push()
        const nuevoRegistroRef = push(estudiantesRef);

        // Crear un objeto con los datos del estudiante
        const datosEstudiante = {
            nombre: nombre,
            apellido: apellido,
            curso: curso
        };

        // Establecer los datos del estudiante en la nueva clave generada
        await set(nuevoRegistroRef, datosEstudiante);

        console.log('Datos cargados exitosamente.');

        // Limpiar el formulario después de cargar los datos
        document.getElementById('dataForm').reset();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// CARGAR MULTIPLES DATOS DESDE UN CSV AL MISMO TIEMPO

// Función para cargar datos desde un archivo CSV
/* async function cargarDatosDesdeCSV(csvData) {
    try {
        // Convertir el CSV a una lista de objetos de estudiantes
        const estudiantes = convertirCSVaObjetos(csvData);

        // Obtener una referencia a la colección de estudiantes en Firebase
        const db = getDatabase();
        const estudiantesRef = ref(db, 'estudiantes');

        // Iterar sobre cada estudiante y guardar los datos en Firebase
        for (const estudiante of estudiantes) {
            // Generar una nueva clave única para el registro utilizando push()
            const nuevoRegistroRef = push(estudiantesRef);
            
            // Establecer los datos del estudiante en la nueva clave generada
            await set(nuevoRegistroRef, estudiante);
        }

        console.log('Datos cargados exitosamente desde el CSV.');
    } catch (error) {
        console.error('Error al cargar los datos desde el CSV:', error);
    }
} 

 // Función para convertir datos CSV a objetos de estudiantes
function convertirCSVaObjetos(csvData) {
    const lineas = csvData.split('\n');
    const estudiantes = [];

    for (const linea of lineas) {
        const campos = linea.split(',');
        const estudiante = {
            nombre: campos[1],
            apellido: campos[0],
            curso: parseInt(campos[2])
        };
        estudiantes.push(estudiante);
    }

    return estudiantes;
}

// Ejemplo de datos CSV
const csvData = `ABREGU, Reynaldo Simo, 1
ACOSTA RAMALLO, Lara Yazmi, 1
BARRIONUEVO, Morena Abigaí, 1
BERTELLO, Violeta Um, 1
BUSTAMANTE RAMIREZ, Ramiro Dant, 1
CARRANZA, Lorena Valentin, 1
CARRERA, Cristian Yande, 1
DESTASI, Uma Jazmi, 1
FERREYRA, Naira Jazmi, 1
LEYVA, Isaias Emanue, 1
MALDONADO, Ludmila So, 1
MALDONADO, Miqueas Ia, 1
MARTINEZ ARRIETA, Lorna Merlin, 1
MERLO CUELLO, Zarina Aile, 1
MIRANDA, Jair Esteba, 1
MONTENEGRO, Maxima Milagro, 1
OBREGON, Alexis Marti, 1
PERALTA, Ciro Yuthie, 1
RAMOS VILLALBA, Ismael Agustí, 1
RODRIGUEZ, Ana Paul, 1
RODRIGUEZ, Paz Esmerald, 1
RODRIGUEZ, Tiziana Celest, 1
RONCO SALVI, Mia Valentin, 1
ROSALES, Solang, 1
SENA, Luz Abigai, 1
TREJO, Bianca Gise, 1
TULIAN, Malena Moren, 1
`;

// Cargar datos desde el CSV
cargarDatosDesdeCSV(csvData);

// CARGAR MULTIPLES DATOS DESDE UN CSV AL MISMO TIEMPO */