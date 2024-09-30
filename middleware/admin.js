const {adminModel} = require("../database");
const jwt = require("jsonwebtoken");
const {admin_Secret_key} = require("../config")


function adminmiddleware(req,res,next){
    const token = req.headers.token;
    try{
        const tokenVerify = jwt.verify(token , admin_Secret_key);
        if(tokenVerify){
            req.id = tokenVerify.id     //esi id mene token ko sign krne me use ki thi..(id) : user._id
            next();
        }else{
            res.json({
                message : "token doesnt exists",
            })
        }  
    }catch(e){
        res.json({
            message : "something is error",
            error : e,
        })
    }
}

module.exports = adminmiddleware;