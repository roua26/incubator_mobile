const mongoose = require('mongoose');
const incubatorSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom de l\'incubateur est requis']
    },
    numeroSerie: {
        type: String,
        required: true,
        unique: true
    },
    modele: String,
    fabricant: String,
    dateInstallation: Date,

    bebe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Baby",
        spare: true,
    },
    capteurs: {
        temperature: { type: Number, default: 36.5 },
        humidite: { type: Number, default: 65 },
        lumiere: { type: Number, default: 40 },
        bruit: { type: Number, default: 30 }
    },


    actionneurs: {
        ventilateur: { type: Boolean, default: false },
        resistance: { type: Boolean, default: false },
        cacheOuvert: { type: Boolean, default: false }
    },
    estConnecte: { type: Boolean, default: true },
    derniereCommunication: { type: Date, default: Date.now },
    batterie: { type: Number, default: 100 },
      historique: [{
    timestamp: { type: Date, default: Date.now },
    type: { 
      type: String, 
      enum: ['alerte', 'changement', 'maintenance', 'connexion'] 
    },
    message: String,
    valeur: mongoose.Schema.Types.Mixed
  }]
  
}, { timestamps: true });
const Incubator= mongoose.model('Incubator',incubatorSchema);
module.exports = Incubator;



