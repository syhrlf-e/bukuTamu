const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World'));
app.listen(3002, () => console.log('Test server running on 3002'));
