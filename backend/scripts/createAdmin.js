const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

mongoose.connect(process.env.DATABASE);

const createAdmin = async () => {
  try {
    

      const admin = await User.create({
        nom: "Admin",
        prenom: "System",
        email: "admin@system.com",
        password: "Admin1234",
        verifPassword: "Admin1234",
        role: "admin"
      });
      console.log('✅ Admin créé:', admin.email);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();