const Baby = require("../models/babyModel");
const Incubator = require("../models/incubatorModel");

exports.createIncubator = async (req, res) => {

    try {
        const incubator = await Incubator.create(req.body)
        res.status(201).json({
            status: 'success',
            data: { incubator }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}
