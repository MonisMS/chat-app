import User from "../models/User";

export const protectedRoute = async(req,res,next) =>{
try {
    const token = req.headers.token;
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protected Route ",error);
        res.status(500).json({ message: "Internal server error" })
    }
}