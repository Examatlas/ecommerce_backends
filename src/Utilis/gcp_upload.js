const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const storage = new Storage({
  credentials
});

const bucketName = 'crown_bucket';
const bucket = storage.bucket(bucketName);
// console.log("bucket: ", bucket);

const uploadFile = async (filePath) => {
    try {
      console.log("uploading a file of filePath: ", filePath);
      // Define the destination name for the uploaded file
      const destinationName = path.basename(filePath);
      
      await bucket.upload(filePath, {
        destination: destinationName,
        resumable: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      console.log(`${filePath} uploaded to ${bucketName} as https://storage.googleapis.com/crown_bucket/${destinationName}`);
      return `https://storage.googleapis.com/${bucketName}/${destinationName}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };


  const deleteFile = async (fileName) => {
    try {
      console.log("Deleting file:", fileName);
      await bucket.file(fileName).delete();
      console.log(`File ${fileName} deleted from bucket ${bucketName}.`);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  };

  
  module.exports = {uploadFile,deleteFile};
  
