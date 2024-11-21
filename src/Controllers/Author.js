const Author = require("../Models/Author");
const {mailPayload} = require("../Utilis/Email/AuthorPayload")

exports.createAuthor = async(req,res)=>{
    try{
        const{authorName , position , email , contactNumber , topic , title , description , previousWork } = req.body
         if(!authorName  ||  !position  || !email  || !contactNumber || !topic || !title || !description || !previousWork ){
            return res.status(422).json({status:false , message:"missing required fields !!"})
         }
            const newAuthor = await Author.create({
                authorName , position , email , contactNumber , topic , title , description , previousWork
            })

            await mailPayload("Author_Request",{
                email,
                cc:["crownclassesrnc@gmail.com"],
                authorName,
                position,
                contactNumber,
                topic,
                title,
                description,
                previousWork
            })

            return res.status(201).json({status:true , message:"author created successfully !!" , data : newAuthor})
        }
    catch(error){
       console.log(error.message)
       return res.status(500).json({status:false , message:"internal server error!!"})
    }
}