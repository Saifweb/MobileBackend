'use strict';

const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();


const {
    HOST,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    Measurement_ID
} = process.env;
assert(HOST, 'HOST is required');
module.exports = {
    host: HOST,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: Measurement_ID
    }
}