require('dotenv').config({ path: 'variables.env'})
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('./db')

const createServer = require('./createServer')
const server = createServer()

server.express.use(cookieParser())

server.express.use((req, res, next) => {
  const { token } = req.cookies

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }

  next()
})

server.express.use(async (req, res, next) => {
  if (!req.userId) return next()
  const user = await db.query.user({
    where: { id: req.userId } },
    '{id, permissions, email, name}'
  )
  req.user = user
  next()
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }},
  details => {
    console.log(`
    Server running 🏋️‍♀️  💅 || http://localhost:${details.port}
    `)
  }
)