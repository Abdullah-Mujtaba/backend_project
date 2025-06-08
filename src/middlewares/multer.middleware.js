import multer from "multer";


//we are usbg diskstorage there is another option to use mememory storage
//but that is costly because RAM can get full when we upload vidoes
//in this function destination: is telling multer where we want to save our files
//the second filename: is what we want to store the file as usually we want to change
//that and not use originalfilename because the user can sometimes upload the same file
//with the same name causing issues will tweak it later
//right now the skipping reason is that because the file will stay for a short amount of time
//on the disk storage it wont create an issue


const storage = multer.diskStorage(
    {
        destination: function(req,file,cb)
        {
            cb(null,'./public/temp')
        },
        filename: function(req,file,cb)
        {
            cb(null,file.originalname)
        }
    })

export const upload = multer({
    storage,
})
