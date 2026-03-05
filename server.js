const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('BSIBG Database Connected!'))
  .catch((err) => console.log('DB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('BSIBG Server is Running...');
});

app.listen(PORT, () => {
  console.log(`Server zooming on port ${PORT}`);
});