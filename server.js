const next = require("next")
const express = require("express")
const axios = require("axios")
const cookieParser = require("cookie-parser")

const dev = process.env.NODE_ENV !== "production"
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

const AUTH_USER_TYPE = "authenticated"
const COOKIE_SECRET = "DUFhuwie"

const authenticate = async (email, password) => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/users")

  return data.find(user => {
    if (user.email == email && user.website == password) {
      return user
    }
  })
}

app.prepare().then(() => {
  const server = express()

  server.use(express.json())
  // Sign cookie to prevent using user modified cookies
  server.use(cookieParser(COOKIE_SECRET))

  server.post("/api/login", async (req, res) => {
    const { email, password } = req.body

    const user = await authenticate(email, password)
    if (!user) {
      return res.status(403).json({ error: "Invalid email or password." })
    }

    const userData = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE
    }

    res.cookie("token", userData, { httpOnly: true, secure: !dev, signed: true })

    res.json(userData)
  })

  server.post("/api/logout", async(req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: !dev, signed: true })
    res.sendStatus(204)
  })

  server.get("/api/profile", async (req, res) => {
    // Get cookie back
    const { signedCookies = {} } = req
    const { token } = signedCookies

    if (token && token.email) {
      const { data } = await axios.get("https://jsonplaceholder.typicode.com/users")
      const userProfile = data.find(user => user.email === token.email)
      return res.json({ user: userProfile })
    } else {
      res.status(404).json({ error: "User not found." })
    }
  })

  server.get("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`Listening on port ${port}`)
  })
})
