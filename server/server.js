// server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import userRouter from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ✅ No need to import or call connectCloudinary

// Middleware
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send("Hello QuickAI")
})

app.use('/api/ai', aiRouter)
app.use('/api/user/',userRouter)

// Start Server
app.listen(PORT, () => {
  console.log("Server running on PORT " + PORT)
})
