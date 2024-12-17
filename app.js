const express = require('express');
const auth = require('./routes/auth');
const lahan = require('./routes/lahan');
const cors = require('cors');
const app = express();


app.use(express.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use('/api', auth);
app.use('/api', lahan);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
