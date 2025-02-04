const mongoose = require('mongoose');

// BUILD THE MONGO URI CONNECTION STRING
const { username, password, projectname } = require('./config.json');
// const mongoURL = `mongodb+srv://${username}:${password}@cluster0.afdjzvo.mongodb.net/${projectname}?retryWrites=true&w=majority`;
const mongoURL = `mongodb+srv://${username}:${password}@cluster0.5jfg2.mongodb.net/${projectname}?retryWrites=true&w=majority&appName=Cluster0`;
// 'retryWrites=true&w=majority&appName=${projectname}'
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Succesfuly connection to Mongo DB');
    } catch (error) {
        console.log(error);
        process.exit();
    }
};
module.exports = { connectDB };