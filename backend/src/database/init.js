
/**
 * INICIALIZACIÓN DE BASE DE DATOS POSTGRESQL
 * 
 * Este archivo crea las tablas necesarias para la aplicación.
 * Se ejecuta automáticamente al iniciar el servidor.
 * 
 * TABLAS:
 * - users: Usuarios del sistema (admin por defecto)
 * - profiles: Perfiles de pagos compartidos
 */

import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

const initDatabase = async () => {
    try {
        console.log('🔧 Inicializando base de datos PostgreSQL...');

        // Crear tabla de usuarios
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Crear tabla de perfiles
        const createProfilesTable = `
            CREATE TABLE IF NOT EXISTS profiles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                pin VARCHAR(50),
                propietario VARCHAR(255) NOT NULL,
                correo VARCHAR(255) NOT NULL,
                plataforma VARCHAR(255) NOT NULL,
                monto DECIMAL(10,2) NOT NULL,
                fecha_pago INTEGER NOT NULL CHECK(fecha_pago >= 1 AND fecha_pago <= 31),
                estado_pago VARCHAR(20) CHECK(estado_pago IN ('pagado', 'pendiente')) DEFAULT 'pendiente',
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `;

        // Ejecutar creación de tablas
        await query(createUsersTable);
        console.log('✅ Tabla users creada/verificada');

        await query(createProfilesTable);
        console.log('✅ Tabla profiles creada/verificada');

        // Crear usuario admin por defecto
        const defaultUsername = process.env.DEFAULT_USERNAME || 'admin';
        const defaultPassword = process.env.DEFAULT_PASSWORD || 'admin123';

        const userCheck = await query('SELECT id FROM users WHERE username = $1', [defaultUsername]);

        if (userCheck.rows.length === 0) {
            // Crear usuario admin
            const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
            await query(
                'INSERT INTO users (username, password) VALUES ($1, $2)',
                [defaultUsername, hashedPassword]
            );
            console.log('👤 Usuario admin creado con éxito');
            console.log(`📝 Credenciales: ${defaultUsername} / ${defaultPassword}`);
        } else {
            console.log('👤 Usuario admin ya existe');
        }

        console.log('🎉 Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
};

export default initDatabase;
