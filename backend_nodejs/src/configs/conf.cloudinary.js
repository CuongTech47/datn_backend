'use strict'

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'shopdev-service', 
  api_key: '412359953526746',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1rAdd1CK3UzX-3wxUucSxRrUiac',
  
});


// console.log(cloudinary.config())

module.exports = cloudinary;