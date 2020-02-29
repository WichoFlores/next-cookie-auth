import Layout from '../components/Layout'
import Link from 'next/link'
import { authInitialProps } from '../lib/auth'

const Index = (props) => {
  return(
    <Layout {...props} title="Home">
      <Link href="/profile">
        <a>Go to profile</a>
      </Link>
    </Layout>
  )
}

Index.getInitialProps = authInitialProps()

export default Index