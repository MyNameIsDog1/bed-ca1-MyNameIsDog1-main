const model = require("../models/reviewModel.js");

module.exports.createReview = (req, res, next) => {
    if (req.body.review_amt == undefined) {
        return res.status(400).send("Error: review_amt is undefined");
    } else if (req.body.review_amt > 5 || req.body.review_amt < 1) {
        return res.status(400).send("Error: review_amt can only be between 1 to 5");
    } else if (req.body.comment == undefined) {
        return res.status(400).send("Error: comment is undefined");
    } else if (!req.session.user_id) {
        return res.status(400).send("Error: User is not logged in");
    }

    const data = {
        user_id: req.session.user_id,
        review_amt: req.body.review_amt,
        comment: req.body.comment,
        username: req.session.username // Ensure username is retrieved from session
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createReview:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            return res.status(201).json(results);
        }
    };

    model.insertSingle(data, callback);
};

module.exports.readReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            if (results.length == 0) {
                return res.status(404).json({
                    message: "Review not found"
                });
            } else return res.status(200).json(results[0]);
        }
    };

    model.selectById(data, callback);
};

module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            return res.status(200).json(results);
        }
    };

    model.selectAll(callback);
};

module.exports.updateReviewById = (req, res, next) => {
    if (req.params.id == undefined) {
        return res.status(400).send("Error: id is undefined");
    } else if (req.body.review_amt == undefined) {
        return res.status(400).send("Error: review_amt is undefined");
    } else if (req.body.review_amt > 5 || req.body.review_amt < 1) {
        return res.status(400).send("Error: review_amt can only be between 1 to 5");
    } else if (req.body.comment == undefined) {
        return res.status(400).send("Error: comment is undefined");
    }

    const data = {
        id: req.params.id,
        review_amt: req.body.review_amt,
        comment: req.body.comment
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateReviewById:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            return res.status(204).send();
        }
    };

    model.updateById(data, callback);
};

module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    message: "Review not found"
                });
            } else {
                return res.status(204).send();
            }
        }
    };

    model.deleteById(data, callback);
};

module.exports.getReviewCounts = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getReviewCounts:", error);
            return res.status(500).json({ message: 'Internal server error', error });
        } else {
            const counts = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            };

            results.forEach(row => {
                counts[row.review_amt] = row.count;
            });

            return res.status(200).json(counts);
        }
    };

    model.getReviewCounts(callback);
};
