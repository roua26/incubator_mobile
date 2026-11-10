const Baby = require("../models/babyModel");
const Incubator = require("../models/incubatorModel");
const User = require("../models/userModel");
const Doctor=require("../models/doctorModel");

exports.createBaby = async (req, res) => {
  try {
    console.log('🔍 Début createBaby');
    console.log('User:', req.user.email);
    
    // 1. Extraire incubateurId et docteurId du body
    const { incubateurId, docteurId, ...babyData } = req.body;
    console.log('incubateurId:', incubateurId);
    console.log('docteurId:', docteurId);

    // 2. Vérifier que l'incubateurId est fourni
    if (!incubateurId) {
      return res.status(400).json({
        status: 'error',
        message: 'ID de l\'incubateur requis'
      });
    }

    // 3. Chercher l'incubateur
    const incubator = await Incubator.findById(incubateurId);
    if (!incubator) {
      return res.status(404).json({
        status: 'error',
        message: "Incubateur n'existe pas"
      });
    }
    console.log('✅ Incubateur trouvé');

    // 4. Vérifier si l'incubateur est déjà utilisé
    if (incubator.bebe) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet incubateur est déjà utilisé'
      });
    }

    // 5. Si un docteurId est fourni, vérifier qu'il existe
    if (docteurId) {
      const doctor = await Doctor.findById(docteurId);
      if (!doctor) {
        return res.status(404).json({
          status: 'error',
          message: 'Docteur non trouvé'
        });
      }
      console.log('✅ Docteur trouvé:', doctor.nom, doctor.prenom);
    }

    // 6. Préparer les données du bébé
    babyData.parent = req.user.id;
    babyData.incubateur = incubateurId;
    
    
    // ✅ Ajouter le docteur si fourni
    if (docteurId) {
      babyData.docteur = docteurId;
    }

    // 7. Créer le bébé
    const baby = await Baby.create(babyData);
    console.log('✅ Bébé créé avec ID:', baby._id);

    // 8. Lier l'incubateur au bébé
    incubator.bebe = baby._id;
    await incubator.save();

    // 9. Lier le bébé au parent
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bebes: baby._id }
    });

    // 10. Si un docteur est assigné, lier le bébé au docteur
    if (docteurId) {
      await Doctor.findByIdAndUpdate(docteurId, {
        $addToSet: { bebes: baby._id },
        $inc: { nombrePatients: 1 }
      });
    }

    // 11. Récupérer le bébé avec toutes ses relations pour la réponse
    const populatedBaby = await Baby.findById(baby._id)
      .populate('incubateur')
      .populate('docteur');

    // 12. Réponse
    res.status(201).json({
      status: 'success',
      data: { baby: populatedBaby }
    });

  } catch (error) {
    console.log('❌ Erreur:', error.message);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
exports.getAllBabies = async (req, res) => {
    try {
        const babies = await Baby.find({ parent: req.user.id }).populate('incubateur').populate('docteur').select("-signesVitaux");
        res.status(200).json({
            status: 'success',
            results: babies.length,
            data: { babies }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}
exports.getBaby = async (req, res) => {
  try {
    const baby = await Baby.findOne({
      _id: req.params.id,
      parent: req.user.id
    }).populate('incubateur');

    if (!baby) {
      return res.status(404).json({
        status: 'error',
        message: 'Bébé non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { baby }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
exports.addVitalSigns = async (req, res) => {
  try {
    const { temperature, frequenceCardiaque, rythmeRespiratoire, saturationOxygene } = req.body;

    const baby = await Baby.findOne({
      _id: req.params.id,
      parent: req.user.id
    });

    if (!baby) {
      return res.status(404).json({
        status: 'error',
        message: 'Bébé non trouvé'
      });
    }

    // Ajouter les signes vitaux
    baby.signesVitaux.push({
      temperature,
      frequenceCardiaque,
      rythmeRespiratoire,
      saturationOxygene,
      source: 'manuel',
      timestamp: new Date()
    });

    // Mettre à jour le cache
    baby.dernierSignesVitaux = {
      temperature,
      frequenceCardiaque,
      rythmeRespiratoire,
      saturationOxygene,
      misAJour: new Date()
    };

    await baby.save();

    res.status(200).json({
      status: 'success',
      data: { signesVitaux: baby.dernierSignesVitaux }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};


exports.getVitalHistory = async (req, res) => {
  try {
    const { period } = req.query; // 24h, 7j, 30j
    let days = 1;

    if (period === '7j') days = 7;
    if (period === '30j') days = 30;

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const baby = await Baby.findOne({
      _id: req.params.id,
      parent: req.user.id
    });

    if (!baby) {
      return res.status(404).json({
        status: 'error',
        message: 'Bébé non trouvé'
      });
    }

    // Filtrer les signes vitaux de la période
    const history = baby.signesVitaux.filter(
      v => v.timestamp >= since
    );

    res.status(200).json({
      status: 'success',
      data: {
        period,
        count: history.length,
        history
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
