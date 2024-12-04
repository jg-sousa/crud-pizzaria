const path = require('path');
const fs = require('fs');
require('dotenv').config();  // Load environment variables from a .env file

const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyDJmcm1dLx4-jpgg7nUHM2XgUElvQx0Dj8",
    authDomain: "pizzaria-a305e.firebaseapp.com",
    databaseURL: "https://pizzaria-a305e-default-rtdb.firebaseio.com",
    projectId: "pizzaria-a305e",
    storageBucket: "pizzaria-a305e.firebasestorage.app",
    messagingSenderId: "198592109960",
    appId: "1:198592109960:web:a043b7f7d39452971b2e3d"
  }
};
`;

const environmentsPath = path.join(__dirname, 'src', 'environments');

// Ensure the directory exists
if (!fs.existsSync(environmentsPath)) {
  fs.mkdirSync(environmentsPath, { recursive: true });
}

fs.writeFileSync(path.join(environmentsPath, 'environment.prod.ts'), envConfigFile);
fs.writeFileSync(path.join(environmentsPath, 'environment.ts'), envConfigFile);
console.log('Environment config file generated');
