const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI') /// stores address from default.json

const connectDB = async () => {
    try{
        await mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})

        console.log('MongoDB Connected...')
    }catch(err){
        console.error(err.message)
        /// Display message and then exit
        process.exit(1)
    }
}

module.exports = connectDB;