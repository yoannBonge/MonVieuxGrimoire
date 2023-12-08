const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");
const booksCtrl = require("../controllers/books");

router.post("/", auth, multer, sharp, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.addRating);
router.put("/:id", auth, multer, sharp, booksCtrl.modifyBook);
router.get("/bestrating", booksCtrl.getTopRatedBooks);
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBooks);
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
