const express = require("express");
const courseRouter = express.Router();
const {courseModel,purchaseModel} = require("../database");
const auth = require("../middleware/user");

courseRouter.post("/purchase",auth,async (req,res)=>{
    //you would expect the user to pay you money
    const userId = req.id;
    const courseId = req.body.courseId;
    //should check that the user has actually paid the price
    await purchaseModel.create({
        userId:userId,
        courseId :courseId
    })
    res.json({
        message : "you have purchased successfully"
    })
})

courseRouter.get("/preview",async (req,res)=>{
    const courses = await courseModel.find();
    res.json({
        courses
    })
})

module.exports = {
    courseRouter : courseRouter
}