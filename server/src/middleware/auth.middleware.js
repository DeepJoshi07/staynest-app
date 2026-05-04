export const authUser = async(req,res,next) =>{
    try {
        
        next()
    } catch (error) {
        console.log("user verification middleware error",error)
    }
}