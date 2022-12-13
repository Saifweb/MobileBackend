'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const userRoutes = require('./routes/user-routes');
const reservationRoutes = require('./routes/reservation-routes');
const authRoutes = require('./routes/auth-routes');


const app = express();
const port = process.env.PORT || 5000;
app.listen(port)
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes.routes);
app.use('/api', reservationRoutes.routes);
app.use('/api', authRoutes.routes);




app.listen(config.port, () => console.log('App is listening on url http://localhost/' + port));
