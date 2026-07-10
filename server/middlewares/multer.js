import multer from "multer"
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public")
    },
    filename:(req,file,cb)=>{
        const filleName=Date.now()+"-"+file.originalname
        cb(null,filleName)
    }
})
export const upload=multer({
    storage,
    limits:{fileSize:5*1024*1024}
})