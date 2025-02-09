const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const db = require('./db');
app.use(express.json());
app.use(cors());

const chauffeurRoute = require('./routes/chauffeurroute');
const enginRoute = require('./routes/enginroute');
const reservationRoute = require('./routes/reservationroute');
const userRoute = require('./routes/userRoute');

app.use('/api/chauffeur', chauffeurRoute);
app.use('/api/engin', enginRoute);
app.use('/api/reservation', reservationRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Base connected on port ${port}`);
})