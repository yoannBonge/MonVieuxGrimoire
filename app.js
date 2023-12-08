const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Cette ligne pour analyser les corps de requêtes au format JSON
app.use(express.json());

app.use((req, res, next) => {
  //On autorise toutes les origines à avoir accès à l'API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  //On spécifie les en-têtes HTTP qui peuvent être utilisés lors de la requête.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //On spécifie les méthodes HTTP qui sont autorisées lors d'une requête cross-origin.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//On configure une route pour servir des fichiers statiques situés dans le répertoire "images".
app.use("/images", express.static(path.join(__dirname, "images")));
//On configure des routes modulaires (pour alléger le code ailleurs et pour séparer les logiques).
//Par exemple, toutes les routes définies dans booksRoutes seront préfixées par "/api/books".
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
