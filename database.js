const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
    email :{type : String, unique : true},
    password : String,
    firstname : String,
    lastname : String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl:{
        type : String,
        required : false
    },
    createrId: ObjectId
    //yha pr admin ki id hogi jisne course launch kia hoga
})

const adminSchema = new Schema({
    email :{type : String, unique : true},
    password : String,
    firstname : String,
    lastname : String
})

const purchaseSchema = new Schema({
    //yha pr kis userne kharida h or knsa course lia h
    userId: ObjectId,
    courseId: ObjectId
})

//models
const userModel = mongoose.model("users",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}
