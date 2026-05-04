export const wrapper = (fn) => {
    return async(req,res,next) => {
        try {
           await fn(req,res,next);
        } catch (error) {
            console.log("internal server error",error)
            return res.status(500).json({
                message:"internal server error!"
            })
        }
    }
}