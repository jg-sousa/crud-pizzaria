const path = require('path');
const fs = require('fs');
require('dotenv').config();  // Load environment variables from a .env file

const envConfigFile = `
export const environment = {
  production: true,
  firebase: {
  apiKey: "AIzaSyAl0Tek5QSvAO9h9J0yMPuHci1H0qlIgew",
  authDomain: "pizzaria-crud-523bc.firebaseapp.com",
  databaseURL: "https://pizzaria-crud-523bc-default-rtdb.firebaseio.com",
  projectId: "pizzaria-crud-523bc",
  storageBucket: "pizzaria-crud-523bc.firebasestorage.app",
  messagingSenderId: "522637532217",
  appId: "1:522637532217:web:2f09ba50783e3b4824c1e8"
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
