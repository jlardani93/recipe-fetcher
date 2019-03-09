import mongoose from 'mongoose'

const uri = `mongodb+srv://justinl93:${process.env.MONGODB_PASSWORD}@recipe-fetcher-database-gcx63.mongodb.net/test?retryWrites=true`
mongoose.connect(uri, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));