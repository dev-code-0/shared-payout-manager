
import { runQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    console.log('🔄 Inicializando base de datos...');

    // Crear tabla de usuarios
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de perfiles
    await runQuery(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        pin TEXT,
        propietario TEXT NOT NULL,
        correo TEXT NOT NULL,
        plataforma TEXT NOT NULL,
        monto INTEGER NOT NULL,
        fecha_pago INTEGER NOT NULL,
        estado_pago TEXT CHECK(estado_pago IN ('pagado', 'pendiente')) DEFAULT 'pendiente',
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Verificar si existe el usuario admin
    const adminExists = await new Promise((resolve, reject) => {
      import('../config/database.js').then(({ getOne }) => {
        getOne('SELECT * FROM users WHERE username = ?', ['admin'])
          .then(resolve)
          .catch(reject);
      });
    });

    // Crear usuario admin si no existe
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await runQuery(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('✅ Usuario admin creado con contraseña: admin123');
    }

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

// Ejecutar si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase()
    .then(() => {
      console.log('Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error durante la inicialización:', error);
      process.exit(1);
    });
}
