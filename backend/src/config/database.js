
/**
 * CONFIGURACIÓN DE BASE DE DATOS SQLITE
 * 
 * Este archivo maneja la conexión a la base de datos SQLite.
 * SQLite es perfecto para aplicaciones pequeñas-medianas y funciona
 * excelente en Render.
 * 
 * IMPORTANTE PARA RENDER:
 * - Los archivos se guardan en un directorio persistente
 * - Render mantiene los datos entre deploys
 */

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear directorio data si no existe
const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Directorio data creado');
}

// Configuración de la base de datos
const dbPath = process.env.DATABASE_PATH || join(dataDir, 'database.sqlite'); //

console.log('🗄️ Conectando a base de datos en:', dbPath);

// Crear conexión a SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error conectando a base de datos:', err.message);
        process.exit(1);
    }
    console.log('✅ Conectado a base de datos SQLite');
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

export default db;
