const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Leer archivo .env
dotenv.config();

// Ruta del archivo environment.ts
const envFolder = path.join(__dirname, 'src', 'environments');
const targetPath = path.join(envFolder, 'environment.ts');

// Crear carpeta si no existe
if (!fs.existsSync(envFolder)) {
fs.mkdirSync(envFolder, { recursive: true });
}

// Generar contenido de environment.ts
const envConfigFile = `
export const environment = {
production: false,
apiUrl: '${process.env.API_URL || ''}',
authToken: '${process.env.AUTH_TOKEN || ''}',
firebaseConfig: {
    apiKey: '${process.env.FIREBASE_API_KEY || ''}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN || ''}',
    projectId: '${process.env.FIREBASE_PROJECT_ID || ''}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET || ''}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID || ''}',
    appId: '${process.env.FIREBASE_APP_ID || ''}'
}
};
`;

// Escribir/actualizar environment.ts
fs.writeFileSync(targetPath, envConfigFile);

console.log('environment.ts generado correctamente desde .env');
