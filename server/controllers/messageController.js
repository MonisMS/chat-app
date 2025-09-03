import Message from "../models/Message";
import User from "../models/User";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //no. of messages not seen
    const unseenMessages = {};
    const promise = filteredUser.map(async (user) => {
      const messages = await MessageChannel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) unseenMessages[user._id] = messages.length;
    });
    await Promise.all(promise);
    res.status(200).json({ user: filteredUser, unseenMessages });
  } catch (error) {
    console.error("error in getUserForSidebar controller:", error);
    res.status(500).json({ error: error.message });
  }
};

//get all messages for selected users
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      {
        seen: true,
      }
    );
    res.json({ messages });
  } catch (error) {
    console.error("error in getMessages controller:", error);
    res.status(500).json({ error: error.message });
  }
};

//api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    console.error("error in markMessageAsSeen controller:", error);
    res.status(500).json({ error: error.message });
  }
};
//send message to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    //Emit new message to reciver socket 
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log("error in sendMessage controller:", error);
    res.status(500).json({ error: error.message });
  }
};


