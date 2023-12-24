import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import { Context } from '../index'
import { isValidEmail } from '../util/validator'

const SignUp = () => {
    const navigate = useNavigate()

    const [accountData, setAccountData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isEmailValid, setIsEmailValid] = useState(false)

    const { store } = useContext(Context)

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            handleRegister()
        }
    }

    const handleRegister = async () => {
        const { username, password, email } = accountData
        const newUser = await store.registration(username, password, email)
            .then(async () => await store.login(username, password))

            console.log('>>>', newUser)

        if (newUser === 200) {
            navigate('/')
        } else {
            toast.error('This email/username is already used')
        }
    }

    const areInputsValid = () => {
        const { username, password, email } = accountData
        const areInputsEmpty = [username, email, password].some(field => !field.trim())
        setIsEmailValid(isValidEmail(email))
        setIsButtonDisabled(areInputsEmpty || !isEmailValid)
    }

    const handleOnChange = (inputName, event) => {
        const { value } = event.target
        setAccountData({ ...accountData, [inputName]: value });
        areInputsValid()
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
                            value={accountData.username}
                            placeholder="Username"
                            onChange={(event) => handleOnChange('username', event)}
                            onKeyDown={handleEnterPress}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor='email'>Email address</label>
                        <input
                            type="email"
                            className={`form-control mt-1
                                ${isEmailValid || !accountData.email ? '' : 'border-danger'}`
                            }
                            id="email"
                            name="email"
                            value={accountData.email}
                            placeholder="Email address"
                            onChange={(event) => handleOnChange('email', event)}
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
                            value={accountData.password}
                            placeholder="Password"
                            onChange={(event) => handleOnChange('password', event)}
                            onKeyDown={handleEnterPress}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button
                            type="button"
                            className={`btn ${isButtonDisabled ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={handleRegister}
                            disabled={isButtonDisabled}
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
