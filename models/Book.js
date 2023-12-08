<<<<<<< HEAD
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      //Cet id: false est présent pour empêcher l'enregistrement de l'id généré par défaut par MongoDB.
      _id: false,
      userId: { type: String },
      grade: { type: Number, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
=======
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      //Cet id: false est présent pour empêcher l'enregistrement de l'id généré par défaut par MongoDB.
      _id: false,
      userId: { type: String },
      grade: { type: Number, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
>>>>>>> b6bac31c52e49d332cdcc01b7d2bce63a35794d8
