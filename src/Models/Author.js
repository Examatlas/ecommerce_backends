const mongoose = require("mongoose")

const AuthorSchema = new mongoose.Schema({
    authorName : {
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    previousWork:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Author",AuthorSchema);