import cloudinary from "../lib/cloudinary";
import { generateToken } from "../lib/utils";
import User from "../models/User";



export const signup = async() => {
const { fullName, email, password, bio } = req.body
try {
    if(!fullName || !email || !password ){
        return res.status(400).json({ message: "All fields are required" })
    }
    const user = await User.findOne({email});
                if(user){
                    return res.status(400).json({ message: "User already exists" })
        }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User ({
        fullName,
        email,
        password: hashedPassword,
        bio
    })
const token = generateToken(newUser._id)
res.status(201).json({ message: "User created successfully", token })

} catch (error) {
    console.log("error in signup controller");
    
    res.status(500).json({ message: "Internal server error" })
}
}



export const login = async (req,res) => {
    try {
        const { fullName,email } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch  =  await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        else {
            const token = generateToken(user._id)
            res.status(200).json({ message: "Login successful", token })
        }

    } catch (error) {
        console.log("error in login controller");
        res.status(500).json({ message: "Internal server error" })
    }
}

export const authCheck = (req,res) => {
    res.json({ user: req.user });
}

export const updateProfile = async (req,res) =>{
    try {
        const { fullName,bio,profilePic } =req.body;
        const userId = req.user._id;
        let updateUser;

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})

        }else{
            const upload = await cloudinary.uploader.upload(profilePic)
            updateUser = await User.findByIdAndUpdate(userId,{bio,fullName,profilePic:upload.secure_url},{new:true})
            res.status(200).json({ message: "Profile updated successfully", user: updateUser })
        }
    } catch (error) {
        console.log("error in updateProfile controller");
        res.status(500).json({ message: "Internal server error" })
    }

}
