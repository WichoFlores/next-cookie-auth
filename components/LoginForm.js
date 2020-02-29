import { useState, useEffect } from 'react'
import { loginUser } from '../lib/auth'
import Router from 'next/router'

const LoginForm = () => {

  const [loginData, setLoginData] = useState({
    email: "Sincere@april.biz", 
    password: "hildegard.org"
  })

  const [error, setError] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  let { email, password } = loginData

  const handleChange = (event) => {
    setLoginData({...loginData, [event.target.name]: event.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    loginUser(email, password).then(() => {
      Router.push("/profile")
    })
    .catch(showError)
  }

  const showError = (error) => {
    console.log(error)
    const errorMessage = error.response && error.response.data.error
    setError(errorMessage)
    setIsLoading(false)
  }

  return(
    <form autoComplete="off" onSubmit={handleSubmit}>
      <div>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} value={email}></input>
      </div>
      <div>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={password}></input>
      </div>
        <button disabled={isLoading} type="submit">{
          isLoading ? "Sending" : "Submit"
        }</button>
        {error && <div>{error}</div>}
    </form>
  )
}

export default LoginForm