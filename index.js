const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
var cors = require('cors');
const AuthRouter = require("./routes/AuthRoute");
const DivisionRoute = require("./routes/DivisionsRoute");
const DistrictRoute = require("./routes/DistrictRoute");


dotenv.config();

const PORT = process.env.PORT || 4200;
const app = express();
app.use(cors())
connectDB();

app.use(express.json()); //to accept json data;

app.get('/', (req, res) => {
    res.send("Yahoo! APP is running successfully!");
});

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/division', DivisionRoute);
app.use('/api/v1/district', DistrictRoute);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, console.log(`Server start on PORT ${PORT}`.yellow.bold));