import { AppProps } from 'next/app'
import axios from 'axios'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import { AuthProvider } from '../context/auth'

import Navbar from '../components/Navbar'
import '../styles/tailwind.css'
import '../styles/icons.css'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url)
    return res.data
  } catch (error) {
    throw error.response.data
  }
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return (
    <SWRConfig value={{
      fetcher,
      dedupingInterval: 10000
    }}>
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : "pt-12" }></div>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  )
}

export default App
