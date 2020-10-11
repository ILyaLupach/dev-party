import express from 'express'
import { connectDB } from './config/db'
import users from './routes/api/users'
import auth from './routes/api/auth'
import profile from './routes/api/profile'
import posts from './routes/api/posts'

const app = express()
const PORT = process.env.PORT || 8080

//connect DB
connectDB()

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

// Define Routes
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
})
