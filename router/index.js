const router = require('express').Router();
const path = require('path');

const publicDir = path.join(__dirname + "./../public/");

router.get("/", (req, res) => {
    res.sendFile(path.join(publicDir + "overlay.html"));
});

module.exports = router;