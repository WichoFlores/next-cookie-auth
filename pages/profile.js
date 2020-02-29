import { useState, useEffect } from 'react'
import { getUserProfile } from '../lib/auth'
import Layout from '../components/Layout'
import { authInitialProps } from '../lib/auth'

const Profile = (props) => {
  
  const [user, setUser] = useState({})
  
  useEffect(() => {
    getUserProfile().then(user => setUser(user))
  }, [])
  
  return(
    <Layout {...props} title="Profile">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  )
}

Profile.getInitialProps = authInitialProps(true)

export default Profile