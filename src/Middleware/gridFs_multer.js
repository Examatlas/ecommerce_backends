const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: process.env.DB,
  file: (req, file) => {
    console.log("running uploadGFS...")
    return new Promise((resolve, reject) => {

        const fileInfo = {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'uploads',
        };
        console.log("fileInfo: ",fileInfo)
        resolve(fileInfo);
    });
  },
});

const uploadGFS = (images)=>{
    try{
     return   multer({ storage }).single(images);
    }catch(err){
        console.log("err: ",err)
    }
}

module.exports = uploadGFS;
