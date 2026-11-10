const Doctor = require('../models/doctorModel');
const Baby = require('../models/babyModel');


exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { doctor }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-motDePasse');
    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: { doctors }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};


exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('bebes', 'nom prenom parent');
    
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Docteur non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { doctor }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Assigner un docteur à un bébé
// @route   PUT /api/babies/:babyId/assign-doctor/:doctorId
// @access  Private (parent ou admin)
exports.assignDoctorToBaby = async (req, res) => {
  try {
    const { babyId, doctorId } = req.params;
    
    // Vérifier que le bébé existe et appartient au parent
    const baby = await Baby.findOne({
      _id: babyId,
      parent: req.user.id
    });
    
    if (!baby) {
      return res.status(404).json({
        status: 'error',
        message: 'Bébé non trouvé'
      });
    }
    
    // Vérifier que le docteur existe
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Docteur non trouvé'
      });
    }
    
    // Mettre à jour le bébé avec le docteur
    baby.docteur = doctorId;
    await baby.save();
    
    // Ajouter le bébé à la liste du docteur
    await Doctor.findByIdAndUpdate(doctorId, {
      $addToSet: { bebes: babyId },
      $inc: { nombrePatients: 1 }
    });
    
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

// @desc    Obtenir le docteur d'un bébé spécifique
// @route   GET /api/babies/:babyId/doctor
// @access  Private
exports.getBabyDoctor = async (req, res) => {
  try {
    const baby = await Baby.findOne({
      _id: req.params.babyId,
      parent: req.user.id
    }).populate('docteur');
    
    if (!baby) {
      return res.status(404).json({
        status: 'error',
        message: 'Bébé non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { doctor: baby.docteur || null }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};