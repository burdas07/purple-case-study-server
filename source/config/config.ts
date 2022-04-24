import dotenv from 'dotenv';
dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    //    poolSize: 50,
    autoIndex: false,
    retryWrites: true
};

const MONGO_USERNAME: string = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || '';
const MONGO_HOST: string = process.env.MONGO_HOST || '';
const DB_NAME: string = process.env.DB_NAME || '';
const PURPLE_COLLECTION_NAME: string = process.env.PURPLE_COLLECTION_NAME || '';

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    dbname: DB_NAME,
    collectionname: PURPLE_COLLECTION_NAME,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${DB_NAME}`
};

// mongodb+srv://purple_case_study:<password>@cluster0.2gvxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const SERVER_HOSTNAME: string = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT: string | number = process.env.SERVER_PORT || 1337;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const MONEYAPI_BASEURL: string = process.env.MONEYAPI_BASEURL || '';
const MONEY_APIKEY: string = process.env.MONEY_APIKEY || '';

const MONEYAPI = {
    baseurl: MONEYAPI_BASEURL,
    apikey: MONEY_APIKEY
};

const config = {
    mongo: MONGO,
    server: SERVER,
    moneyapi: MONEYAPI
};

export default config;
