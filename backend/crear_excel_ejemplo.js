const XLSX = require('xlsx');

// Datos de ejemplo
const data = [
    {
        'Cédula': '1098765432',
        'Email': 'juan.perez@fesc.edu.co',
        'Nombre': 'Juan Pérez García',
        'Programa': 'Ingeniería de Software',
        'Sede': 'Sede FESC Cúcuta'
    },
    {
        'Cédula': '1087654321',
        'Email': 'maria.lopez@fesc.edu.co',
        'Nombre': 'María López Rodríguez',
        'Programa': 'Diseño Gráfico',
        'Sede': 'Sede FESC Cúcuta'
    },
    {
        'Cédula': '1076543210',
        'Email': 'carlos.martinez@fesc.edu.co',
        'Nombre': 'Carlos Martínez Sánchez',
        'Programa': 'Administración de Negocios',
        'Sede': 'Sede FESC Ocaña'
    },
    {
        'Cédula': '1065432109',
        'Email': 'ana.garcia@fesc.edu.co',
        'Nombre': 'Ana García Torres',
        'Programa': 'Diseño de Modas',
        'Sede': 'Sede FESC Cúcuta'
    },
    {
        'Cédula': '1054321098',
        'Email': 'pedro.rodriguez@fesc.edu.co',
        'Nombre': 'Pedro Rodríguez Gómez',
        'Programa': 'Gestión Turística',
        'Sede': 'Sede FESC Ocaña'
    },
    {
        'Cédula': '1043210987',
        'Email': 'laura.hernandez@fesc.edu.co',
        'Nombre': 'Laura Hernández Díaz',
        'Programa': 'Comercio Internacional',
        'Sede': 'Sede FESC Cúcuta'
    }
];

// Crear workbook y worksheet
const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Egresados');

// Guardar archivo en el directorio raíz del proyecto
XLSX.writeFile(wb, '../egresados_ejemplo.xlsx');

console.log('✅ Archivo egresados_ejemplo.xlsx creado exitosamente');
console.log(`📊 Contiene ${data.length} egresados de ejemplo`);
