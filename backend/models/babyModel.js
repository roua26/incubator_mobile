const mongoose =require('mongoose');
const babySchema =new mongoose.Schema({
    nom :{
        type :String,
        required:[true, "le nom de bebe est obligatoire"],
        minlength:3,
        maxlength:20,
    },
    prenom:{
        type :String,
        required:[true, "le nom de bebe est obligatoire"],
        minlength:3,
        maxlength:10,
    },
    dateNaissance:{
        type:Date,
        required: true,
    },
    sexe:{
        type:String,
        enum :['garçon' , 'fille'],
    },
    poidsNaissance:Number,
    tailleNaissance:Number,

    parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    incubateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    required: true,
    unique: true
    },
     docteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true 
  },

    signesVitaux: [{
    timestamp: { type: Date, default: Date.now },
    frequenceCardiaque: Number,
    temperature: Number,
    rythmeRespiratoire: Number,
    saturationOxygene: Number,
    source: { 
      type: String, 
      enum: ['automatique', 'manuel'], 
      default: 'automatique' 
    }
    }],
    dernierSignesVitaux: {
    frequenceCardiaque: Number,
    temperature: Number,
    rythmeRespiratoire: Number,
    saturationOxygene: Number,
    misAJour: Date
    },
      estActif: { type: Boolean, default: true },
  dateSortie: Date
  
}, { timestamps: true} 
);
babySchema.post('save', async function(doc) {
  if (doc.docteur) {
    await mongoose.model('Doctor').findByIdAndUpdate(doc.docteur, {
      $addToSet: { bebes: doc._id },
      $inc: { nombrePatients: 1 }
    });
  }
});

// babySchema.pre('save', function(next) {
//   if (this.signesVitaux && this.signesVitaux.length > 0) {
//     const dernier = this.signesVitaux[this.signesVitaux.length - 1];
//     this.dernierSignesVitaux = {
//       frequenceCardiaque: dernier.frequenceCardiaque,
//       temperature: dernier.temperature,
//       rythmeRespiratoire: dernier.rythmeRespiratoire,
//       saturationOxygene: dernier.saturationOxygene,
//       misAJour: dernier.timestamp
//     };
//   }
//   next();
// });
const Baby = mongoose.model("Baby", babySchema);
module.exports = Baby;


