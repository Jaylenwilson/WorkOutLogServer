const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/register", async (req, res) => {

    let { userName, password } = req.body.User;
    try {
        const User = await UserModel.create({
            userName,
            password: bcrypt.hashSync(password, 13),
        })

        let token = jwt.sign({ id: User.id, userName: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User succesfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }

});

router.post("/login", async (req, res) => {
    let { userName, password } = req.body.User
    try {
        const loginUser = await UserModel.findOne({
            where: {
                userName: userName,
            },
        });



        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password)

            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });


                res.status(200).json({
                    message: "User logged in succesful",
                    user: loginUser,
                    sessionToken: token
                })
            } else {
                res.status(401).json({
                    message: "Incorrect password or username"
                })
            }
        } else {
            res.status(401).json({
                message: "Login failed"
            });
        }
    } catch {
        res.status(500).json({
            message: "Failed to log in user"
        })

    }
});

module.exports = router;