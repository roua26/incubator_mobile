const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  
  nom: {
    type: String,
    required: [true, "Le nom du docteur est requis"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"]
  },
  prenom: {
    type: String,
    required: [true, "Le prénom du docteur est requis"],
    trim: true,
    minlength: [2, "Le prénom doit contenir au moins 2 caractères"],
    maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"]
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"]
  },
  telephone: {
    type: String,
    required: [true, "Le téléphone est requis"],
    match: [/^[0-9]{10}$/, "Numéro de téléphone invalide"]
  },
  
 
  specialite: {
    type: String,
    required: [true, "La spécialité est requise"],
    enum: [
      'néonatologie',
      'pédiatrie',
      'réanimation néonatale',
      'cardiologie pédiatrique',
      'pneumologie pédiatrique',
      'généraliste'
    ],
    default: 'pédiatrie'
  },
  
  
  
  hopital: {
    nom: { type: String, required: true },
    adresse: {
      rue: String,
      ville: String,
      codePostal: String,
      pays: { type: String, default: 'Tunisie' }
    },
    telephone: String
  },
  
  disponibilites: [{
    jour: {
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    },
    heureDebut: String,
    heureFin: String,
    estDisponible: { type: Boolean, default: true }
  }],
  
 
  bebes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby'
  }],
  
 
  nombrePatients: {
    type: Number,
    default: 0
  },
  
  
  motDePasse: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['docteur', 'admin'],
    default: 'docteur'
  },
  
  // Dates
  dateCreation: {
    type: Date,
    default: Date.now
  },
  derniereConnexion: Date,
  
  // Statut
  estActif: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });



const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;