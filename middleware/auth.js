const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  //On vient vérifier la validité du token du header de la requête, et si l'utilisateur
  //est valide, on extraie son ID pour l'ajouter à l'objet de requête.
  try {
    const token = req.headers.authorization.split(" ")[1];
    //On vérifie la validité du jeton en le décodant avec la clé secrète.
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
