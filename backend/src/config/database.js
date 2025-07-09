
/**
 * CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
 * 
 * Este archivo maneja la conexión a la base de datos PostgreSQL.
 * PostgreSQL es perfecto para aplicaciones en producción y 
 * Render lo soporta nativamente.
 * 
 * IMPORTANTE PARA RENDER:
 * - Render proporciona automáticamente la DATABASE_URL
 * - La conexión se hace a través de la URL completa
 */

import pg from 'pg';
const { Client } = pg;

// Configuración de conexión PostgreSQL
const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};


// Crear cliente PostgreSQL
const db = new Client(connectionConfig);

// Conectar a la base de datos
db.connect()
    .then(() => {
    })
    .catch(err => {
        process.exit(1);
    });

// Función helper para ejecutar queries con promesas
export const query = (text, params) => {
    return db.query(text, params);
};

export default db;
