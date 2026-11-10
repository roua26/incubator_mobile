const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  try {
    console.log('🔍 ÉTAPE 1: Vérification du token...');
    
    // 1. Récupérer le token du header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token trouvé:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Pas de token dans les headers');
      return res.status(401).json({ 
        message: 'Non autorisé - Token manquant' 
      });
    }

    // 2. Vérifier que le token est valide
    console.log('🔍 ÉTAPE 2: Vérification du token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token valide, utilisateur ID:', decoded.id);

    // 3. Vérifier que l'utilisateur existe encore
    console.log('🔍 ÉTAPE 3: Recherche de l\'utilisateur...');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(401).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    console.log('✅ Utilisateur trouvé:', user.email);

    // 4. Vérifier si le compte est actif
    if (!user.estActif) {
      console.log('❌ Compte désactivé');
      return res.status(401).json({ 
        message: 'Compte désactivé' 
      });
    }

    // 5. Ajouter l'utilisateur à la requête
    req.user = user;
    console.log('✅ Utilisateur ajouté à req.user');
     if (typeof next === 'function') {
      console.log('🔄 Appel de next() pour passer au contrôleur');
      next();  // ← Passe au contrôleur
    } else {
      console.log('❌ next n\'est pas une fonction! Type:', typeof next);
      return res.status(500).json({ 
        message: 'Erreur de configuration du serveur' 
      });
    }
    
    
  } catch (error) {
    console.log('❌ Erreur d\'authentification:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token invalide' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expiré' 
      });
    }
    
    res.status(401).json({ 
      message: 'Erreur d\'authentification' 
    });
  }
};

// // Middleware optionnel pour restreindre aux admins
// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         message: 'Vous n\'avez pas la permission' 
//       });
//     }
//     next();
//   };
// };