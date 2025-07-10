/**
 * VALIDACIÓN DE VARIABLES DE ENTORNO
 * 
 * Este archivo valida que todas las variables críticas estén definidas
 * antes de iniciar la aplicación.
 */

const validateEnvironment = () => {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 Copia el archivo env.example a .env y configura las variables');
    process.exit(1);
  }

  // Validar JWT_SECRET en producción
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'tu_jwt_secret_super_seguro_aqui') {
    console.error('❌ JWT_SECRET debe ser cambiado en producción');
    process.exit(1);
  }

  console.log('✅ Variables de entorno validadas correctamente');
};

export default validateEnvironment; 