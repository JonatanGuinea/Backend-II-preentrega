import * as url from 'url';


const config = {
    APP_NAME: 'coder70190',
    PORT: 3000,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    // getter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/coder70190',
    MONGODB_URI: 'mongodb+srv://jonatanguinea7:642859Jj642859@cluster0.mesld.mongodb.net/products',
    SECRET: 'codersecret',
    GITHUB_CLIENT_ID: 'Iv23lifxh3zbGdyUZLNJ',
    GITHUB_CLIENT_SECRET: '4e6058727fd0338a8772d460e953462273dedce5',
    GITHUB_CALLBACK_URL: 'http://localhost:3000/api/users/ghcallback',
    /**
     * Una expresión regular (regex) nos permite evaluar una cadena para determinar si cumple o no
     * con un formato específico, en este caso, si corresponde a un id de MongoDB válido.
     */
    MONGODB_ID_REGEX: '/^[a-f\d]{24}$/i'
};


export default config;
