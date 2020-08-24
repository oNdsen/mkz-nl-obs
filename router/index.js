const router = require('express').Router();
const path = require('path');

const publicDir = path.join(__dirname + "./../public/");

let owData;

router.get("/overlay", (req, res) => {
    res.sendFile(path.join(publicDir + "overlay.html"));
});

router.get("/admin", (req, res) => {
    res.sendFile(path.join(publicDir + "admin.html"));
});

router.get("/admin/update", (req, res) => {
    if (owData != undefined) {
        res.json({
            data: owData
        });

        owData = undefined;
    }
});

router.post("/admin/data", (req, res, next) => {
    let body = req.body;

    owData = {
        name: body.name,
        score: {
            left: body.lscore,
            right: body.rscore
        }
    }
});

module.exports = router;