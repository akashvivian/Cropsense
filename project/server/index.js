require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const weatherRoutes = require('./routes/weatherRoutes');
const cropRoutes = require('./routes/cropRoutes');
const farmRoutes = require('./routes/farmRoutes');
const authRoutes = require('./routes/authRoutes');
const soilRoutes = require('./routes/soilRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/recommend', cropRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api', chatRoutes);

// Start server immediately — chat works even without MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB connects in background
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
