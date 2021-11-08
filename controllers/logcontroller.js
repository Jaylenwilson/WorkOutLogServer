const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.get("/", validateJWT, async (req, res) => {
    const { id } = req.user
    try {
        const logEntries = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });

        res.status(200).json(logEntries);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result, } = req.body.log;
    const { id } = req.user
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json({ newLog, message: "log created" });
    } catch (err) {
        res.status(500).json({ error: err });
    }

});


router.delete("/:id", validateJWT, async (req, res) => {
    const logId = req.params.id;
    const ownerId = req.params.id;
    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: "Log entry removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }

});

router.put("/:entryId", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id
    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(updatedLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get("/:id", validateJWT, async (req, res) => {
    const { id } = req.params
    try {
        const query = {
            where: {
                id: id
            }
        };
        const logEntries = await LogModel.findOne(query)
        res.status(200).json({
            message: logEntries
        })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router;


// const express = require("express");
// const router = express.Router();
// let validateJWT = require("../middleware/validate-session");
// const { Animal } = require("../models");



// router.get("/", validateJWT, async (req, res) => {
//     const { id } = req.user
//     try {
//         const query = {
//             where: {
//                 userId: id
//             }
//         };
//         const animalEntries = await Animal.findAll();
//         res.status(200).json(animalEntries);
//     } catch (err) {
//         res.status(500).json({ error: err })
//     }
// });

// router.post("/create", validateJWT, async (req, res) => {
//     const { name, legNumber, predator, } = req.body.animal;
//     const { id } = req.user
//     const animalEntry = {
//         name,
//         legNumber,
//         predator,
//         userId: id
//     }
//     try {
//         const newAnimal = await Animal.create(animalEntry);
//         res.status(200).json({ newAnimal, message: "animal created" });
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
//     // Animal.create(animalEntry)
// });


// router.delete("/delete/:id", validateJWT, async (req, res) => {
//     const animalId = req.params.id;
//     const { id } = req.user
//     try {
//         const query = {
//             where: {
//                 id: animalId,
//                 userId: id
//             }
//         };
//         await Animal.destroy(query);
//         res.status(200).json({ message: "Animal entry removed" });
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }

// });

// router.put("/update/:entryId", validateJWT, async (req, res) => {
//     const { name, legNumber, predator } = req.body.animal;
//     const animalId = req.params.entryId;

//     const query = {
//         where: {
//             id: animalId
//         }
//     };

//     const updatedAnimal = {
//         name: name,
//         legNumber: legNumber,
//         predator: predator
//     };

//     try {
//         const update = await Animal.update(updatedAnimal, query);
//         res.status(200).json(update);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// });

// module.exports = router;