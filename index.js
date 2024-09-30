require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');
const {Adminrouter} = require('./routes/admin');
const app = express();
const port = 5000;

app.use(express.json());

//yha pr /user and /course to by default prefix honge
//when we want to access user toute then go with /user and same...

app.use("/admin",Adminrouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

async function connectdb(){
    await mongoose.connect(process.env.MONGO_URL);
    //await mongoose.connect("mongodb+srv://shivhares2002:mww8frbY4dnHF92a@cluster0.gq0hu.mongodb.net/courseera-App");
    //await mongoose.connect("mongodb+srv://shivhares2002:SNs4CtvJc1A15Hjv@courseera-app.d8d6i.mongodb.net/?retryWrites=true&w=majority&appName=courseera-app")
}

connectdb();

app.listen(port,()=>{
    console.log(`listining on port : ${port}`);
});