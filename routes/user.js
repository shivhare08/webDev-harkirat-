const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/user");
// const Secret_key = "shashank";
const { user_Secret_key } = require("../config");
const { userModel, courseModel, purchaseModel } = require("../database");
const bcrypt = require('bcrypt');

userRouter.post("/signup", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        const requiredBody = zod.object({
            email: zod.string().max(25).email(),
            password: zod.string().min(3),
            firstname: zod.string().max(20).min(1),
            lastname: zod.string().max(20).min(1),
        })

        const parseDataWithSuccess = requiredBody.safeParse(req.body);

        if (!parseDataWithSuccess.success) {
            res.json({
                message: "wrong format",
                error: parseDataWithSuccess.error
            })
            return;
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const createData = await userModel.create({
            email: email,
            password: hashpassword,
            firstname: firstname,
            lastname: lastname
        })
        res.json({
            message: "signup successfully",
            data: createData
        })
    } catch (e) {
        res.json({
            message: "catch error",
            error: e,
        })
    }

})

userRouter.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const valid_user = await userModel.findOne({ email: email });

        if (!valid_user) {
            res.json({
                message: "catch error",
                error: e,
            })
            return;
        }

        const compare = await bcrypt.compare(password, valid_user.password)
        if (compare) {
            const token = await jwt.sign({
                id: valid_user._id,
            }, user_Secret_key);

            res.json({
                message: "congratulation",
                yourToken: token,
                userDetails: valid_user
            })
        } else {
            res.status(403).json({
                message: "you are farzi"
            })
        }
    }
    catch (e) {
        res.json({
            message: "catch error",
            error: e,
        })
    }
})

userRouter.get("/purchased", auth, async (req, res) => {
    const userid = req.id;
    const purchased = await purchaseModel.find({ userId: userid });

    const courseId = await courseModel.find({
        _id: { $in: purchased.map(x => x.courseId)}
    })
    res.json({
        your_courses: courseId,
        purchased : purchased
    })
})

// userRouter.get("/allcourse",async (req,res)=>{
//     const courses = await courseModel.find();
//     res.json({
//         course : courses
//     })
// })

module.exports = {
    userRouter: userRouter
}