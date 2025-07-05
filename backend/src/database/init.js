
/**
 * INICIALIZACIÓN DE BASE DE DATOS
 * 
 * Este archivo crea las tablas necesarias para la aplicación.
 * Se ejecuta automáticamente al iniciar el servidor.
 * 
 * TABLAS:
 * - users: Usuarios del sistema (admin por defecto)
 * - profiles: Perfiles de pagos compartidos
 */

import db from '../config/database.js';
import bcrypt from 'bcryptjs';

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        console.log('🔧 Inicializando base de datos...');

        // Crear tabla de usuarios
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Crear tabla de perfiles
        const createProfilesTable = `
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                pin TEXT,
                propietario TEXT NOT NULL,
                correo TEXT NOT NULL,
                plataforma TEXT NOT NULL,
                monto REAL NOT NULL,
                fecha_pago INTEGER NOT NULL,
                estado_pago TEXT CHECK(estado_pago IN ('pagado', 'pendiente')) DEFAULT 'pendiente',
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `;

        // Ejecutar creación de tablas
        db.serialize(() => {
            db.run(createUsersTable, (err) => {
                if (err) {
                    console.error('❌ Error creando tabla users:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Tabla users creada/verificada');
            });

            db.run(createProfilesTable, (err) => {
                if (err) {
                    console.error('❌ Error creando tabla profiles:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Tabla profiles creada/verificada');
            });

            // Crear usuario admin por defecto
            const defaultUsername = process.env.DEFAULT_USERNAME || 'admin';
            const defaultPassword = process.env.DEFAULT_PASSWORD || 'admin123';

            db.get('SELECT id FROM users WHERE username = ?', [defaultUsername], (err, row) => {
                if (err) {
                    console.error('❌ Error verificando usuario admin:', err);
                    reject(err);
                    return;
                }

                if (!row) {
                    // Crear usuario admin
                    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
                    db.run(
                        'INSERT INTO users (username, password) VALUES (?, ?)',
                        [defaultUsername, hashedPassword],
                        function(err) {
                            if (err) {
                                console.error('❌ Error creando usuario admin:', err);
                                reject(err);
                                return;
                            }
                            console.log('👤 Usuario admin creado con éxito');
                            console.log(`📝 Credenciales: ${defaultUsername} / ${defaultPassword}`);
                            resolve();
                        }
                    );
                } else {
                    console.log('👤 Usuario admin ya existe');
                    resolve();
                }
            });
        });
    });
};

export default initDatabase;
