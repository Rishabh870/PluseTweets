const multer = require('multer');
const path = require('path');

const getUpload = (routeName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder;
      if (routeName === 'profileImg') {
        destinationFolder = 'profileImg';
      } else if (routeName === 'tweetImg') {
        destinationFolder = 'tweetImg';
      } else {
        destinationFolder = 'uploads'; // Default destination folder
      }
      cb(null, 'Images/' + destinationFolder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
  });

  // Filter function to accept only certain file types
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
    }
  };

  // Add the 'limits' option to configure file size limit
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: {
    //   fileSize: 10 * 1024 * 1024, // 10 MB (adjust this value as needed)
    // },
  });

  // Set up multer middleware with the configuration
  return upload;
};

module.exports = getUpload;
