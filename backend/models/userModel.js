const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    // Informations personnelles
    nom: {
        type: String,
        required: [true, "Le nom est obligatoire"],
        trim: true,
        minlength: [3, "Le nom doit contenir au moins 3 caractères"],
        maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"]
    },
    prenom: {
        type: String,
        required: [true, "Le prénom est obligatoire"],
        trim: true,
        minlength: [3, "Le prénom doit contenir au moins 3 caractères"],
        maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"]
    },
    email: {
        type: String,
        required: [true, "L'email est obligatoire"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Email invalide"]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
        select: false
    },
    verifPassword: {
        type: String,
        required: [true, "La confirmation du mot de passe est obligatoire"],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Les mots de passe ne correspondent pas"
        }
    },
    
    // Rôle
    role: {
        type: String,
        enum: ["parent", "medecin", "admin"],
        default: "parent"
    },
    
    // Contact
    telephone: {
        type: String,
        match: [/^[0-9]{8}$/, "Numéro de téléphone invalide"]
    },
    adresse: {
        rue: String,
        ville: String,
        codePostal: String,
        pays: { type: String, default: 'Tunisie' }
    },
    
    // Dates importantes
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateModificationPassword: {
        type: Date,
        default: Date.now
    },
    derniereConnexion: Date,
    
    // Statut du compte
    estActif: {
        type: Boolean,
        default: true
    },
    estVerifie: {
        type: Boolean,
        default: false
    },
    
    // Tokens pour réinitialisation
    tokenVerification: String,
    tokenResetPassword: String,
    tokenResetPasswordExpire: Date,
    
    // Relation avec les bébés (optionnel - tableau vide par défaut)
    bebes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Baby'
    }]
    
}, { 
    timestamps: true,
});

userSchema.pre('save',async function (next) {
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12)

        this.verifPassword=undefined
    }
    return next;
    
});
userSchema.methods.comparerMotDePasse = async function(password) {
  return await bcrypt.compare(password, this.password);
};




const User = mongoose.model("User", userSchema);
module.exports = User;