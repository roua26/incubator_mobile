const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config({ path: "./.env" });

const userRoutes = require('./routes/userRoutes');
const babyRoutes = require('./routes/babyRoutes');
const incubatorRoutes = require('./routes/incubatorRoutes');
const doctorRoutes=require('./routes/doctorRoutes');


mongoose
  .connect(process.env.DATABASE)
  .then(() => { console.log("✅ connexion à la base de données sécurisée !!!") })
  .catch((e) => { console.log("❌ Erreur MongoDB: " + e) });

console.log('🔑 JWT_SECRET chargé:', process.env.JWT_SECRET ? '✅ OUI' : '❌ NON');

const app = express();


app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/baby', babyRoutes);
app.use('/api/incubator', incubatorRoutes);
app.use('/api/doctor',doctorRoutes);

const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Le serveur est lancé sur http://0.0.0.0:${port}`);
  

  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`📱 Accessible sur http://${net.address}:${port}`);
      }
    }
  }
});