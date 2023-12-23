const jwt = require("jsonwebtoken");
const Auth = require("../models/AuthModal");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};



const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const headersToken = authHeader.split(" ")[1];

        try {
            // Verify the token
            const decoded = jwt.verify(headersToken, process.env.JWT_SECRET);

            const getUser = await Auth.findOne({ _id: decoded.id });
            if (!getUser) {
                res.status(401);
                return res.json({ message: "Invalid Access Token!" });
            }
            const matchToken = getUser.tokens.find((tokenObj) => tokenObj.token === headersToken);

            if (typeof matchToken === "undefined" || matchToken === null) {
                res.status(401);
                return res.json({ message: "Invalid Access Token!" }); // Send custom error message
            } else {
                // Attach the user object to the request
                req.user = decoded;
                next();
            }
        } catch (error) {
            next(error); // Pass the error to the error handler middleware
        }
    } else {
        res.status(401);
        return res.json({ message: "Unauthorized Access!" }); // Send custom error message
    }
};



module.exports = {generateToken, authenticateToken};