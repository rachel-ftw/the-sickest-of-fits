require('dotenv').config({ path: 'variables.env'})

const createServer = require('./createServer')
const server = createServer()

// TODO use express middleware to handle cookies/JWT
// TODO use express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }},
  details => {console.log(`Server running 🏋️‍♀️  💅 || http://localhost:${details.port}`)}
)