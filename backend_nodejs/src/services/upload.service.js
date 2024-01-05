'use strict'

const cloudinary = require('../configs/conf.cloudinary')
// 1 upload image from url image

const uploadImageFromUrl = async (url) => {
    try {
        const urlImage = 'https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/393828456_263642339986143_530793502144233007_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_ohc=P_8h1yma3QwAX9HEvNA&_nc_ht=scontent.fdad3-6.fna&_nc_e2o=f&oh=00_AfCwNK0bPdRqO_Kx3wq9QUW-r8rbq_CishpH-5OSqLI2Bg&oe=653C6680'
        const folderName = 'product/shopId' , newFileName = 'product_name_demo'

        const result = await cloudinary.uploader.upload(urlImage, {
            folder : folderName,

        })

        console.log(result);

        return result

    } catch (error) {
        console.log('Error Upload image::',error);
    }
}


// 2 upload image from local

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/1007',
   

}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id:'thumb',
            folder : folderName,

        })

        console.log(result);

        return {
            image_url: result.secure_url,
            shopId: 1007,
            thumb_url: await cloudinary.url(result.public_id,{
                height:100,
                width:100,
                format:'jpg'
            } )
        }
        
    } catch (error) {
        console.log('Error Upload image::',error);
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}