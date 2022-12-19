const express = require('express');
const controller = require("./controller")
const router = express.Router();

router.post("/register", controller.createAccount);
router.post("/login", controller.login);
router.get("/", controller.getAttendance);
router.put("/", controller.presentAttendance);
router.post("/", controller.resetAttendance)
router.get("/account", controller.getAccount);
router.get("/account/:nim", controller.getAccountByNIM);
router.put("/account", controller.changePassword); 
router.delete("/account", controller.deleteAccount);


module.exports = router;