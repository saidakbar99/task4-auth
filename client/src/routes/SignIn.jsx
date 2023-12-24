import React, {useContext, useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import { Context } from '../index'

const SignIn = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { store } = useContext(Context)

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin()
        }
    }

    const handleLogin = async () => {
        const loginStatus = await store.login(username, password)

        switch (loginStatus) {
            case 200:
                navigate('/')
                break
            case 400:
                toast.error('This user is blocked')
                break
            default:
                toast.error('Wrong username/password')
        }
    }

    const areInputsEmpty = [username, password].some(field => !field.trim())

    return(
        <>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="form-group mt-3">
                            <label htmlFor='username'>Username</label>
                            <input
                                type="username"
                                className="form-control mt-1"
                                id="username"
                                name="username"
                                value={username}
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleEnterPress}
                                autoFocus
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
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleEnterPress}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button
                                type="button"
                                className={`btn ${areInputsEmpty ? 'btn-secondary' : 'btn-primary'}`}
                                onClick={handleLogin}
                                disabled={areInputsEmpty}
                            >
                                Sign in
                            </button>
                        </div>
                        <p className="mt-2">
                            Don't have an account yet? {' '}
                            <NavLink to="/sign_up">
                                Sign up
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

export default SignIn
