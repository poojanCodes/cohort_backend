let mongoose = require('mongoose');
require('dotenv').config();

async function connectToDb(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database has been connected')
    })
}

module.exports = connectToDb ; 