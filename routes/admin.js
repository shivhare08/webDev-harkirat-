const express = require('express');
const Adminrouter = express.Router();
const {adminModel , courseModel} = require("../database");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const Secret_key = "shivhare";
const {admin_Secret_key} = require("../config");
const auth = require("../middleware/admin");



Adminrouter.post("/signup",async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        const reqBody = zod.object({
            email : zod.string().max(25).email(),
            password : zod.string().min(3),
            firstname : zod.string().max(20).min(1),
            lastname : zod.string().max(20).min(1),
        })

        const parsedata = reqBody.safeParse(req.body);
        if(!parsedata.success){
            res.json({
                message : "wrong format"
            })
            return;
        }

        const hashpassword = await bcrypt.hash(password , 10);
        const createData = await adminModel.create({
            email : email,
            password : hashpassword,
            firstname : firstname,
            lastname : lastname
        })
        res.json({
            message : "signup successfully"
        })
    }catch(e){
        res.json({
            message : "catch error",
            error : e
        })
    }
})

Adminrouter.post("/signin",async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    try{
        const valid_admin = await adminModel.findOne({email : email});

        if(!valid_admin){
            res.json({
                message : "catch error",
                error : e,
            })
            return;
        }

        const compare = await bcrypt.compare(password,valid_admin.password )
        if(compare){
            const token = jwt.sign({
               id:valid_admin._id, 
            },admin_Secret_key);

            res.json({
                message: "congratulation",
                yourToken: token,
                userDetails: valid_admin
            })
        }else{
            res.status(403).json({
                message: "you are farzi"
            })
        }
    }
    catch(e){
        res.json({
            message : "catch error",
            error : e,
        })
    }
})

Adminrouter.post("/course",auth, async (req,res)=>{
    const admin_id = req.id;
    const admin = await adminModel.findById(admin_id)

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    //const imageUrl= req.body.imageUrl;

    const zodValidation = zod.object({
        title : zod.string().max(20),
        description : zod.string().max(100).min(5),
        price : zod.number().min(2500)
    })

    const parsedata = zodValidation.safeParse(req.body);
    if(!parsedata.success){
        res.json({
            message : "wrong format",
        })
        return;
    }

    const createData = await courseModel.create({
        createrId : admin_id,
        title : title,
        description : description,
        price : price
    })

    res.json({
        course_data : createData,
        message : "course successfully"
    })


})

Adminrouter.put("/course/update",auth,async (req,res)=>{
    const admin_id = req.id;

    const {title , description , price ,courseId } = req.body;

    const course = await courseModel.updateOne({
        //conditions
        _id : courseId,
        createrId : admin_id
    },{
        title:title,
        description : description,
        price : price
    })

    res.json({
        message:"course is updated",
        course_Id : course._id
    })
})

Adminrouter.get("/allcourse",auth ,async (req,res)=>{
    const adminId = req.id
    const courses = await courseModel.find({
        createrId : adminId
    });
    res.json({
        creater_courses : courses
    })
})

module.exports = {
    Adminrouter : Adminrouter
}