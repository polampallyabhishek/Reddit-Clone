import { FormEvent, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

import InputGroup from '../components/InputGroup'
import { useAuthState } from '../context/auth'

export default function Register() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [agreement, setAgreement] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const { authenticated } = useAuthState()

    const router = useRouter()
    if(authenticated) router.push('/')

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()

        try {
            const res = await axios.post('/auth/register', {
                email, username, password
            })

            router.push('/login')
            console.log(res.data)
        } catch (error) {
            console.log(error)
            setErrors(error.response.data)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Register Account</title>
            </Head>

            <div className="h-screen w-36" style={{ backgroundImage: "url('/images/register.jpg')", backgroundPosition: 'bottom' }}></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
                    <p className="mb-10 text-xs">By continuing, you agree to our User Agreement and Privacy Policy</p>
                    <form onSubmit={submitForm}>
                        <div className="mb-6">
                            <input type="checkbox" checked={agreement} onChange={e => setAgreement(e.target.checked)} className="mr-1 cursor-pointer" id="agreement"/>
                            <label htmlFor="agreement" className="text-xs cursor-pointer">I agree to get emails about cool stuff on Reddit</label>
                        </div>
                        <InputGroup className="mb-2" errLength={6} value={email} setValue={setEmail} placeholder="Email" error={errors.email} type="email" />
                        <InputGroup className="mb-2" errLength={3} value={username} setValue={setUsername} placeholder="Username" error={errors.username} type="text" />
                        <InputGroup className="mb-2" errLength={6} value={password} setValue={setPassword} placeholder="Password" error={errors.password} type="password" />
                        <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                            Sign Up
                        </button>
                    </form>
                    <small>
                        Already a redditor?
                        <Link href="/login">
                            <a className="ml-1 text-blue-500 uppercase">
                                Login
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}