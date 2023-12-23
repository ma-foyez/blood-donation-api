const mongoose = require("mongoose");
mongoose.set('strictQuery', false); // Set strictQuery to false

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, {dbName: process.env.db_name}, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: true
        });

        console.log(`MongoDB connect : ${connect.connection.host}`.cyan.underline);
    } catch (error) {
        console.log('error :>> ', error.message.red.bold);
        process.exit();
    }
}

module.exports = connectDB;