import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import { Context } from '../index'

const SignUp = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { store } = useContext(Context)

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            handleRegister();
        }
    }

    const handleRegister = async () => {
        const newUser = await store.registration(username, password, email)
            .then(async () => await store.login(username, password))

        if (newUser?.status === 200) {
            navigate('/')
        } else {
            toast.error('This email/username is already used', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
            })
        }
    }

  return (
    <>
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="form-group mt-3">
                        <label htmlFor='username'>Username</label>
                        <input
                            type="username"
                            className="form-control mt-1"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleEnterPress}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor='email'>Email address</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            id="email"
                            name="email"
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleEnterPress}
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor='password'>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleEnterPress}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleRegister}
                        >
                            Sign up
                        </button>
                    </div>
                    <p className="mt-2">
                        Already have an account? {' '}
                        <NavLink to="/sign_in">
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </form>
        </div>
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
        />
    </>
  )
}

export default SignUp
