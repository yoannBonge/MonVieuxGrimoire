const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res) => {
  //On initialise un objet livre duquel on va extraire les données du body de la requête.
  const bookObject = JSON.parse(req.body.book);
  //On supprime le champ _id généré par MongoDB.
  delete bookObject._id;
  //On crée donc un livre en récupérant toutes les infos du corps de la requête et en lui attribuant l'ID
  //de l'utilisateur qui l'a crée, et on crée une URL pour l'image chargée.
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyBook = (req, res) => {
  //On commence par vérifier si la requête contient un fichier (une image). Si oui, on fait comme dans createBook,
  //sinon on récupère simplement toutes les infos du corps de la requête.
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé" });
      } else {
        //On extrait le nom de l'image pour ensuite la supprimer du serveur avec fs.unlink.
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getTopRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((topRatedBooks) => res.status(200).json(topRatedBooks))
    .catch((error) => res.status(500).json({ error }));
};

exports.addRating = (req, res) => {
  const userId = req.auth.userId;
  const rating = req.body.rating;
  const userRating = { userId, grade: rating };
  //On vérifie si l'utilisateur à déjà noté ce livre. Si c'est le cas, on l'indique.
  Book.findOne({ _id: req.params.id, "ratings.userId": userId }).then(
    (bookRatedByUser) => {
      if (bookRatedByUser) {
        return res
          .status(400)
          .json({ message: "L'utilisateur a déjà noté ce livre" });
      }
    }
  );
  //On met à jour le livre en ajoutant la nouvelle note (userRating) au tableau des notes (ratings).
  //Le {new: true} spécifie que la méthode findByIdAndUpdate doit renvoyer le document mis à jour
  //après l'opération. Sans cette option, elle renverrait le document avant la mise à jour.
  Book.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { ratings: userRating } },
    { new: true }
  ).then((book) => {
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable" });
    }
    //On met à jour la note moyenne du livre.
    const totalRatings = book.ratings.reduce(
      (sum, rating) => sum + rating.grade,
      0
    );

    book.averageRating = totalRatings / book.ratings.length;
    book
      .save()
      .then(() => {
        res.status(200).json(book);
      })
      .catch((error) => res.status(500).json({ error }));
  });
};
