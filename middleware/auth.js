<<<<<<< HEAD
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //On vérifie la validité du jeton en le décodant. La chaîne "RANDOM_TOKEN_SECRET" est utilisée comme clé secrète
    //pour la vérification.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //On extrait l'ID de l'utilisateur du contenu décodé du jeton.
    const userId = decodedToken.userId;
    //On ajoute l'ID de l'utilisateur à l'objet de requête sous la propriété "auth".
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
=======
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //On vérifie la validité du jeton en le décodant. La chaîne "RANDOM_TOKEN_SECRET" est utilisée comme clé secrète
    //pour la vérification.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //On extrait l'ID de l'utilisateur du contenu décodé du jeton.
    const userId = decodedToken.userId;
    //On ajoute l'ID de l'utilisateur à l'objet de requête sous la propriété "auth".
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
>>>>>>> b6bac31c52e49d332cdcc01b7d2bce63a35794d8
