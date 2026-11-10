const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRES_IN}
   
 );
};

exports.register = async (req, res) => {
  try {
   
    const user = await User.create(req.body);
    
    
    const token = signToken(user._id);
    
    
    res.status(201).json({
      message: "user created!",
      token, 
      data: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: {
        name: error.name,
        message: error.message,
        details: error.errors
      }
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('🔍 ===== DÉBUT LOGIN =====');
    console.log('📦 BODY REÇU:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ Champs manquants');
      return res.status(400).json({ 
        message: 'Email et mot de passe requis' 
      });
    }

    console.log('🔍 Recherche user:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User non trouvé');
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    console.log('✅ User trouvé:', user.email);
    console.log('🔑 Vérification password...');
    
    const isMatch = await user.comparerMotDePasse(password);
    console.log('✅ Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    console.log('✅ Token généré avec succès');
    console.log('🔑 ===== FIN LOGIN =====');
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('❌ ERREUR CATASTROPHIQUE:');
    console.error('Nom:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      message: 'error', 
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bebes');
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      message: 'error',
      error: error
    });
  }
};


exports.logout = (req, res) => {
  try {
    
    res.status(200).json({
      status: 'success',
      message: 'Déconnexion réussie'
    });

 
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};