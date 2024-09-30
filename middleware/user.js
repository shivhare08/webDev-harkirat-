const {userModel} = require("../database");
const jwt = require("jsonwebtoken");
const {user_Secret_key} = require("../config")

function usermiddleware(req,res,next){
    const token = req.headers.token;
    const tokenVerify = jwt.verify(token , user_Secret_key);
    try{
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

module.exports = usermiddleware;