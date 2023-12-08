const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = (req, res, next) => {
  if (req.file && req.file.path) {
    const name = req.file.originalname.split(" ").join("_");
    //On obtient l'extension du fichier.
    const extension = path.extname(name);
    //On retire l'extension du nom du fichier original.
    const fileName = name.replace(extension, "");
    //On crée un nouveau nom pour le fichier optimisé...
    const outputFileName = `${fileName}_${Date.now()}.webp`;
    //...ainsi qu'un chemin pour ce dernier.
    const outputPath = path.join(__dirname, "..", "images", outputFileName);

    //On initialise un objet Sharp avec l'image du fichier spécifié par req.file.path
    sharp(req.file.path)
      .toFormat("webp", { quality: 50 })
      .resize(300, 500, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(outputPath, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Erreur lors de l'optimisation de l'image." });
        }
        //On met à jour la requête en ajoutant le nouveau nom de fichier.
        req.file.filename = outputFileName;

        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({
            error:
              "Le fichier de sortie après le traitement Sharp n'existe pas",
          });
        }

        // fs.unlink(req.file.path, (unlinkError) => {
        //   if (unlinkError) {
        //     if (unlinkError.code === "ENOENT") {
        //       console.warn(
        //         "Le fichier a déjà été supprimé par un autre processus."
        //       );
        //     } else {
        //       console.error(
        //         "Erreur lors de la suppression de l'image non traitée:",
        //         unlinkError
        //       );
        //     }
        //   }

        next();
      });
    // });
  } else {
    console.log("Image non modifiée");
    next();
  }
};
