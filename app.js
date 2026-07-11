require('dotenv').config();
const express = require('express');
const connectDB = require('./models/db');
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use('/api/customer', require('./routes/customer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/staff', require('./routes/staff'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
