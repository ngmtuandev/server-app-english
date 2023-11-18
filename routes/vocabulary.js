const vocabularyController = require("../controllers/vocabulary");
const express = require("express");
const verifyToken = require("../middeware/verifyToken");
const verifyAdmin = require("../middeware/verifyAdmin");
const router = express.Router();

router.post("/create-voca", [verifyToken] ,vocabularyController.createVoca);
router.get("/all-voca", [verifyToken] , vocabularyController.getAllVocaUser);
router.get("/finish-voca", [verifyToken] , vocabularyController.allVocaLearnFinish);
router.get("/voca-learn", [verifyToken] , vocabularyController.listVocaLearn);
router.get("/:eng", [verifyToken] , vocabularyController.getItemVoca);
router.put("/:eng", [verifyToken] , vocabularyController.learnVoca);
router.delete("/:eng", [verifyToken] , vocabularyController.deleteVoca);


module.exports = router;