import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId:{
type:Mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
  },
  text:{
    type:String,
    required:true
  },
  receiverId:{
    type:Mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  image:{
    type:String,
    
  },
  seen:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)
export default Message
