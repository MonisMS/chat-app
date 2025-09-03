import express from "express"
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController"
import { protectedRoute } from "../middleware/auth"
import e from "express"

const messageRouter = express.Router()

messageRouter.get("/users", protectedRoute, getUserForSidebar)
messageRouter.get("/:id", protectedRoute, getMessages)
messageRouter.put("/mark/:id", protectedRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectedRoute,sendMessage)
export default messageRouter