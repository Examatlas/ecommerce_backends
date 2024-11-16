const jwt = require("jsonwebtoken")
const User = require("../Models/user")


//Authentication
exports.isAuthenticated = async(req,res,next)=>{

    try{
        const {authorization} = req.headers;
        // console.log("authorization: ", authorization);
        if(!authorization){
          return res.status(401).json({success: false, message: 'Unauthorized, Please sign-in again!'});
        }
        let verify = jwt.verify(authorization.slice(7, authorization.length), process.env.JWT_SECRET);
        //   console.log("verify: ",verify)
        if(!verify){
          return res.status(401).json({success: false, message: 'Unauthorized, Please sign-in again!'});
        }    req.user = verify;
        next();
      }catch(err){
        console.log("error in auth middleware: ", err);
        return res.status(401).json({success: false, message: 'Unauthorized, Please sign-in again!', error: err}); 
      }

    // const token = req.headers["x-api-key"]

    // if(!token){
    //     return res.status(401).json({status:false,message:"token is required"})
    // }
    // const decodedData = jwt.verify(token,process.env.JWT_SECRET)
    // console.log(decodedData)
    // console.log(decodedData.userId)

    // req.user = await User.findById(decodedData.userId)
    // console.log(req.user)

    // next();
}



// authorization 
exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(400).json({ 
                status:false,
                message: `${req.user.role} is not allowed to access this other user's data.`
            })
        }
        next();
    }
}
