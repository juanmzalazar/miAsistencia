// app.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Declarar un array para almacenar los valores de las fechas
let fechas = [];

// Definir las fechas para cada curso para el año 2024
const fechas_1roB = ['26-02', '04-03', '11-03', '18-03', '25-03', '01-04', '08-04', '15-04', '22-04', '29-04','06-05', '13-05', '20-05', '27-05', '03-06', '10-06', '17-06', '24-06', '01-07', '08-07', '15-07', '22-07', '29-07', '05-08', '12-08', '19-08', '26-08', '02-09', '09-09', '16-09','23-09', '30-09', '07-10', '14-10', '21-10', '28-10', '04-11', '11-11', '18-11', '25-11','02-12', '09-12', '16-12'];
const fechas_3roB = ['01-03', '08-03', '15-03', '22-03', '29-03', '05-04', '12-04', '19-04', '26-04','03-05', '10-05', '17-05', '24-05', '31-05', '07-06', '14-06', '21-06', '28-06','05-07', '12-07', '19-07', '26-07', '02-08', '09-08', '16-08', '23-08', '30-08','06-09', '13-09', '20-09', '27-09', '04-10', '11-10', '18-10', '25-10', '01-11','08-11', '15-11', '22-11', '29-11', '06-12', '13-12', '20-12'];


// Función para limpiar el color de fondo de todos los encabezados de fecha
function limpiarColoresEncabezados() {
    const tablaEncabezados = document.querySelectorAll('#tablaAsistencia th');
    tablaEncabezados.forEach((th, index) => {
        if (index >= 2) { // Solo limpiar colores de las columnas de fecha
            th.style.backgroundColor = '';
            th.style.color = '';
        }
    });
}


// Definir un array global para almacenar los IDs de los estudiantes
let studentIds = [];


// Función para hacer la tabla clickeable
function hacerTablaClickeable() {
    const tablaAsistencia = document.getElementById('tablaAsistencia');
    /* tablaAsistencia.style.backgroundColor = '#FFF000'; */
    tablaAsistencia.classList.remove('no-click');
}


// Función para resaltar el botón activo
function resaltarBotonActivo(boton) {
    // Remover la clase activa de todos los botones
    document.getElementById('primerBoton').classList.remove('active-button');
    document.getElementById('tercerBoton').classList.remove('active-button');

    // Añadir la clase activa al botón clickeado
    boton.classList.add('active-button');
}


// Escuchar clics en los botones y llamar a la función mostrarTabla
document.getElementById('primerBoton').addEventListener('click', () => {
    hacerTablaClickeable();
    resaltarBotonActivo(event.target);
    fechas = fechas_1roB;    
    generarTablaEnBlanco(fechas);
    mostrarTabla(1);
});

document.getElementById('tercerBoton').addEventListener('click', () => {
    hacerTablaClickeable();
    resaltarBotonActivo(event.target);
    fechas = fechas_3roB;    
    generarTablaEnBlanco(fechas);
    mostrarTabla(3);
});



// Objeto para almacenar el estado del modo de cada columna
const modoColumna = {};

// Función para cambiar el modo de una columna
function cambiarModoColumna(colIndex, modo) {
    modoColumna[colIndex] = modo;
}

// Función para determinar si una columna está en modo "Ingresar Nota"
function obtenerModoColumna(colIndex) {
    const table = document.getElementById('tablaAsistencia');
    const headerCell = table.rows[0].cells[colIndex];
    const headerColor = getComputedStyle(headerCell).backgroundColor;

    return headerColor === 'rgb(173, 216, 230)'; // lightblue in RGB
}


// Función para manejar NOTA NUMERICA en celda
function manejarClickCeldaNota(event) {
    const cell = event.target;
    const oldValue = cell.innerText;

    // Crear el popup
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '10';
    input.value = oldValue;

    const buttonOK = document.createElement('button');
    buttonOK.classList.add('button-ok');
    buttonOK.innerHTML = '<i class="fa fa-check"></i>';

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('button-cancel');
    buttonCancel.innerHTML = '<i class="fa fa-trash"></i>';

    function cerrarPopup() {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    }

    function guardarNota(valor) {
        cell.innerText = valor;
        // Obtener el índice de la fila y la columna
        const rowIndex = cell.parentNode.rowIndex - 1; // Restar 1 para excluir el encabezado
        const colIndex = cell.cellIndex;
        // Obtener la fecha del encabezado correspondiente
        const fecha = fechas[colIndex - 2]; // Restar 2 para excluir las dos primeras columnas
        const estudianteID = studentIds[rowIndex]; // Obtener el ID del estudiante del array global
        // Guardar la NOTA en Firebase
        console.log('manejarClickCelda -> guardarRegistroNota:', estudianteID, fecha, valor);
        guardarRegistroNota(estudianteID, fecha, valor);
        cerrarPopup();
    }

    function actualizarCelda() {
        const valor = parseInt(input.value, 10);
        console.log('valor=',valor);
        if (valor >= 1 && valor <= 10) {
            console.log('Guardé la Nota: ', valor);
            guardarNota(input.value);
        } else {
            // Restaurar el valor original en la celda si el valor no es válido
            console.log('Restauré el oldValue: ', oldValue);
            cell.innerText = oldValue;
            cerrarPopup();
        }
    }

    function cancelarYVaciarCelda() {
        guardarNota(''); // Guardar valor vacío
    }

    buttonOK.addEventListener('click', actualizarCelda);
    buttonCancel.addEventListener('click', cancelarYVaciarCelda);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            actualizarCelda();
        } else if (event.key === 'Escape') {
            cerrarPopup();
        }
    });

    popup.appendChild(input);
    popup.appendChild(buttonOK);
    popup.appendChild(buttonCancel);
    document.body.appendChild(popup);
    input.focus();

    // Cerrar el popup si se hace clic fuera de él
    document.addEventListener('click', function eventHandler(event) {
        if (!popup.contains(event.target) && event.target !== cell) {
            cerrarPopup();
            document.removeEventListener('click', eventHandler);
        }
    });

    // Cerrar el popup si se presiona la tecla Escape
    document.addEventListener('keydown', function eventHandler(event) {
        if (event.key === 'Escape') {
            cerrarPopup();
            document.removeEventListener('keydown', eventHandler);
        }
    });

    // Evitar que el clic en la celda se propague al documento y cierre el popup
    cell.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}
// FIN manejarClickCeldaNota


// Función para guardar el registro de asistencia en Firebase
function guardarRegistroAsistencia(estudianteId, fecha, asistencia) {
    const registroRef = ref(database, `estudiantes/${estudianteId}/asistencia/${fecha}`);
    set(registroRef, asistencia)
        .then(() => {
            console.log(`Registro de asistencia para ${fecha} actualizado para el estudiante con ID ${estudianteId}`);
        })
        .catch((error) => {
            console.error('Error al actualizar el registro de asistencia:', error);
        });
}


// Función para guardar el registro de asistencia en Firebase
function guardarRegistroNota(estudianteId, fecha, nota) {
    const registroRef = ref(database, `estudiantes/${estudianteId}/notas/${fecha}`);
    set(registroRef, nota)
        .then(() => {
            console.log(`Registro de Nota para ${fecha} actualizado para el estudiante con ID ${estudianteId}`);
        })
        .catch((error) => {
            console.error('Error al actualizar el registro de Nota:', error);
        });
}


// Función para obtener la columna correspondiente a una fecha invertida
function obtenerColumnaFecha(fechaInversa) {
    const indice = fechas.indexOf(fechaInversa);
    if (indice !== -1) {
        // Sumar 2 al índice para compensar las dos primeras columnas de número de estudiante y nombre
        return indice + 2;
    } else {
        // Si no se encuentra la fecha, devolver -1 o manejar el caso según sea necesario
        return -1;
    }
}


// Función para colocar la asistencia en la celda correspondiente
function colocarAsistenciaEnCelda(estudianteId, fechaInversa, columnIndex, asistencia) {
    // Obtener la fila correspondiente al estudiante
    const tablaAsistencia = document.getElementById('tablaAsistencia').getElementsByTagName('tbody')[0];
    const rowIndex = studentIds.indexOf(estudianteId);
    if (rowIndex !== -1) {
        const filaEstudiante = tablaAsistencia.rows[rowIndex + 1]; // Sumar 1 para evitar el encabezado
        if (filaEstudiante) {
            // Actualizar la celda en la columna encontrada con el valor de asistencia
            const celda = filaEstudiante.cells[columnIndex + 2]; // Sumar 2 para compensar las primeras dos celdas
            if (celda) {
                celda.textContent = asistencia;
            } else {
                console.error(`No se pudo encontrar la celda para el estudiante ${estudianteId} y la fecha ${fechaInversa}`);
            }
        } else {
            console.error(`No se pudo encontrar la fila para el estudiante ${estudianteId}`);
        }
    } else {
        console.error(`No se pudo encontrar el índice para el estudiante ${estudianteId}`);
    }
}


// Agregar evento de clic a todas las celdas de la tabla (excepto los encabezados)
document.getElementById('tablaAsistencia').addEventListener('click', manejarClickCelda);


// Función para manejar el clic en una celda (ciclo P, A, vacío)
function manejarClickCelda(event) {
    const cell = event.target;
    if (cell.tagName === 'TD') {
        // Prevent default behavior and stop propagation to avoid multiple event triggers
        event.preventDefault();
        event.stopImmediatePropagation();
        
        const currentValue = cell.textContent.trim();        
        const colIndex = cell.cellIndex;

        // Verificar si la columna está en modo Ingresar Nota
        if (obtenerModoColumna(colIndex)) {
            return; // No hacer nada si está en modo Ingresar Nota
        }
        // Si no está en modo Ingresar Nota, cambiar el valor de la celda        
        switch (currentValue) {
            case '':
                cell.textContent = 'P';
                break;
            case 'P':
                cell.textContent = 'A';
                break;
            case 'A':
                cell.textContent = '';                               
        }
        
        // Obtener el índice de la fila y la columna
        const rowIndex = cell.parentNode.rowIndex - 1; // Restar 1 para excluir el encabezado
        
        // Obtener la fecha del encabezado correspondiente
        const fecha = fechas[colIndex - 2]; // Restar 2 para excluir las dos primeras columnas
        const estudianteID = studentIds[rowIndex]; // Obtener el ID del estudiante del array global

        // Guardar la ASISTENCIA en Firebase
        console.log('manejarClickCelda -> guardarRegistroAsistencia:',estudianteID, fecha, cell.textContent);
        guardarRegistroAsistencia(estudianteID, fecha, cell.textContent);
    }
}


// Función para cambiar el comportamiento de las celdas en una columna
function cambiarComportamientoCeldas(colIndex) {
    console.log('cambiarComportamientoCeldas');
    const filas = document.querySelectorAll('#tablaAsistencia tbody tr');
    const nuevoModo = obtenerModoColumna(colIndex) ? '' : 'ingresarNota'; // Invertir el modo actual
    cambiarModoColumna(colIndex, nuevoModo); // Establecer el nuevo modo para la columna
    filas.forEach((fila, filaIndex) => {
        if (filaIndex > 0) { // Saltar la fila de encabezados
            const celda = fila.cells[colIndex];
            celda.dataset.mode = nuevoModo;
            if (nuevoModo === 'ingresarNota') {
                /* celda.style.backgroundColor = 'orange'; */  // Cambiar el color de fondo de la celda
                celda.removeEventListener('click', manejarClickCelda); // Remover el evento de clic de asistencia
                celda.addEventListener('click', manejarClickCeldaNota); // Agregar el evento de clic para ingresar nota
            } else {
                celda.style.backgroundColor = '';  // Restaurar el color de fondo original de la celda
                celda.removeEventListener('click', manejarClickCeldaNota); // Remover el evento de clic para ingresar nota
                celda.addEventListener('click', manejarClickCelda); // Agregar el evento de clic de asistencia
            }
        }
    });
}


// Función para generar la tabla en blanco al cargar la página
function generarTablaEnBlanco(fechas) {
    const tablaBody = document.querySelector('#tablaAsistencia tbody');
    const tablaHead = document.querySelector('#tablaAsistencia thead');

    // Limpiar el contenido actual de la tabla
    tablaBody.innerHTML = '';
    tablaHead.innerHTML = '';

    // Agregar encabezados
    const encabezados = ['N°', 'Estudiantes', ...fechas]; // Incluir los encabezados fijos y las fechas

    const encabezadosRow = document.createElement('tr');

    encabezados.forEach((encabezado, index) => {
        const th = document.createElement('th');
        th.textContent = encabezado;
        

        if (index >= 2) { // Solo las columnas de fecha serán clickeables
            th.classList.add('fecha-clickable');
            th.classList.remove('no-click'); // Aseguramos que los encabezados de fechas no tengan la clase no-click
            th.addEventListener('click', () => {
                toggleColumnColor(index);
            });
        } else {
            th.classList.add('no-click');
            /* th.classList.add('no-mover'); */
        }
        
        // Aplicar la clase 'no-mover-fila' a los encabezados        
        
        encabezadosRow.appendChild(th);
        
    });

    tablaHead.appendChild(encabezadosRow);

    // Agregar filas con celdas vacías
    const numFilas = 30; // Número de filas en blanco

    for (let i = 0; i < numFilas; i++) {
        const fila = document.createElement('tr');

        // Aplicar clase según si la fila es par o impar
/*         if (i % 2 === 0) {
            fila.classList.add('no-moverPar');
        } else {
            fila.classList.add('no-moverImpar');
        } */

        for (let j = 0; j < encabezados.length; j++) {
            const celda = document.createElement('td');
            celda.textContent = ''; // Contenido vacío
            celda.classList.add('fondoBlanco');
            celda.classList.add('no-click'); // Hacer todas las celdas no-click por defecto
/*             if (j < 2) {
                celda.classList.add('no-mover');
            } */
            fila.appendChild(celda);
        }
    tablaBody.appendChild(fila);
    }

}

// Función para mostrar la tabla de estudiantes de un curso
function mostrarTabla(curso) {
    const tablaAsistencia = document.getElementById('tablaAsistencia').getElementsByTagName('tbody')[0];

    // Limpiar solo las celdas de los datos de los estudiantes
    const filas = tablaAsistencia.querySelectorAll('tr');
    for (let i = 0; i < filas.length; i++) { // Comenzar desde la primera fila de datos
        const celdas = filas[i].querySelectorAll('td');
        for (let j = 0; j < celdas.length; j++) {
            celdas[j].textContent = ''; // Limpiar solo las celdas de fecha
            celdas[j].classList.add('no-click'); // Asegurarse de que las celdas sean no-click
        }
    }

    // Limpiar el array de IDs de estudiantes
    studentIds = [];

    // Consultar estudiantes del curso especificado
    const studentsRef = ref(database, 'estudiantes');
    get(studentsRef).then((snapshot) => {
        let contador = 1; // Contador para el número de fila

        // Arreglo para almacenar los estudiantes ordenados por apellido
        const estudiantesOrdenados = [];

        snapshot.forEach((childSnapshot) => {
            const studentData = childSnapshot.val();

            if (studentData.curso === curso) {
                // Convertir el apellido a mayúsculas
                const apellidoMayuscula = studentData.apellido.toUpperCase();
                // Generar un identificador único para el estudiante
                const estudianteId = childSnapshot.key;
                // Agregar el estudiante al arreglo de estudiantes ordenados
                estudiantesOrdenados.push({ id: estudianteId, apellido: apellidoMayuscula, nombre: studentData.nombre });
            }
        });

        // Ordenar los estudiantes por apellido
        estudiantesOrdenados.sort((a, b) => a.apellido.localeCompare(b.apellido));

        // Agregar los estudiantes ordenados a la tabla
        estudiantesOrdenados.forEach((estudiante, index) => {
            // Obtener la fila correspondiente al estudiante
            const fila = tablaAsistencia.rows[index]; // Obtener la fila correcta

            // Actualizar las celdas de número y nombre de estudiante
            fila.cells[0].textContent = contador++;
            fila.cells[1].textContent = `${estudiante.apellido}, ${estudiante.nombre}`;

            // Aplicar la clase no-click a las celdas de número y nombre de estudiante
            fila.cells[0].classList.add('no-click');            
            fila.cells[1].classList.add('no-click');
            
            // Aplicar fondo blanco para efecto de scroll
            fila.cells[0].classList.add('fondoBlanco');
            fila.cells[1].classList.add('fondoBlanco');

            // Agregar el ID del estudiante al array global
            studentIds.push(estudiante.id);

            // Obtener las asistencias del estudiante
            const asistenciasRef = ref(database, `estudiantes/${estudiante.id}/asistencia`);
            get(asistenciasRef).then((snapshot) => {
                const asistencias = snapshot.val();
                if (asistencias) {
                    Object.entries(asistencias).forEach(([fecha, asistencia]) => {
                        const columnIndex = fechas.indexOf(fecha);
                        if (columnIndex !== -1) {
                            fila.cells[columnIndex + 2].textContent = asistencia; // Sumar 2 para compensar las primeras dos celdas
                        }
                    });
                }            
            });

            // Obtener las notas del estudiante
            const notasRef = ref(database, `estudiantes/${estudiante.id}/notas`);
            get(notasRef).then((snapshot) => {
                const notas = snapshot.val();
                if (notas) {
                    Object.entries(notas).forEach(([fecha, nota]) => {
                        const columnIndex = fechas.indexOf(fecha);
                        if (columnIndex !== -1 && nota !== "") {
                            fila.cells[columnIndex + 2].textContent = nota; // Sumar 2 para compensar las primeras dos celdas
                        }
                    });
                }            
            });
        });
    }).catch((error) => {
        console.error("Error al leer datos de estudiantes:", error);
    });

    // Mostrar la tabla
    document.getElementById('tablaContainer').style.display = 'block';
}



function toggleColumnColor(columnIndex) {
    const table = document.getElementById('tablaAsistencia');
    const rows = table.rows;
    const headerCell = rows[0].cells[columnIndex];

    // Obtener el color actual de la celda del encabezado
    const currentColor = getComputedStyle(headerCell).backgroundColor;    

    // Ciclar el color de la celda del encabezado
    let newColor;
    switch (currentColor) {
        case 'rgb(255, 255, 0)': // yellow in RGB
            newColor = 'lightblue';
            break;
        case 'rgb(173, 216, 230)': // lightblue in RGB
            newColor = '';
            break;
        default:
            newColor = 'yellow';
    }

    // Resetear todas las columnas a "sin color" y hacerlas no clickeables
    for (let i = 2; i < rows[0].cells.length; i++) {
        rows[0].cells[i].style.backgroundColor = '';
        for (let j = 1; j < rows.length; j++) {
            rows[j].cells[i].style.backgroundColor = '';
            rows[j].cells[i].classList.add('no-click'); // Hacer no clickeable
            rows[j].cells[i].removeEventListener('click', manejarClickCelda);
            rows[j].cells[i].removeEventListener('click', manejarClickCeldaNota);            
        }
    }

    headerCell.style.backgroundColor = newColor;
    console.log('newColor', newColor);

    // Aplicar el comportamiento correspondiente a la columna
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].cells[columnIndex];
        if (newColor === 'yellow') {
            cell.classList.remove('no-click'); // Hacer clickeable
            cell.addEventListener('click', manejarClickCelda);
        } else if (newColor === 'lightblue') {
            cell.classList.remove('no-click'); // Hacer clickeable
            cell.addEventListener('click', manejarClickCeldaNota);
        } else {
            cell.classList.add('no-click'); // Hacer no clickeable
        }
    }
}

// Añadir eventos a los encabezados de las fechas
document.querySelectorAll('#tablaAsistencia th.fecha-clickable').forEach((th, index) => {
    th.addEventListener('click', () => toggleColumnColor(index + 2)); // Sumar 2 para excluir las dos primeras columnas
});


// Mostrar/ocultar el botón "ir al principio de la tabla" basado en el desplazamiento horizontal
$(document).ready(function() {
    // Detectar scroll en el contenedor de la tabla
    $('.scrollable-table').scroll(function () {
        if ($(this).scrollLeft() >= 50) { // Si la tabla se desplaza horizontalmente más de 50px
            $('#scroll-to-start').fadeIn(200); // Aparece el botón
        } else {
            $('#scroll-to-start').fadeOut(200); // Desaparece el botón
        }
    });
    
    $('.scrollable-table').scroll(function () {
    /* $(window).scroll(function () { */
        if ($(this).scrollTop() >= 50) { // Si la página se desplaza verticalmente más de 50px
            $('#return-to-top').fadeIn(200); // Aparece el botón
        } else {
            $('#return-to-top').fadeOut(200); // Desaparece el botón
        }
    });

    // Al hacer clic en el botón "ir al principio de la tabla"
    $('#scroll-to-start').click(function () {
        // Mover la tabla hacia la izquierda, al inicio
        $('.scrollable-table').animate({
            scrollLeft: 0 // Desplazarse hacia la izquierda
        }, 500);
    });

    // Al hacer clic en el botón "ir al principio"
    $('#return-to-top').click(function () {
        $('.scrollable-table').animate({
            scrollTop: 0 // Desplazarse hacia arriba
        }, 500);
    });
});
