import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            //! call link
            const response = await axios.post('http://localhost:5000/sign_up', {
                username: username,
                password: password,
                email: email
                //! call link
            }).then(async() => await axios.post('http://localhost:5000/sign_in', {
                username: username,
                password: password
            }))
            const { token } = response.data
//! refactor DUPLICATE
            if (token) {
                navigate('/')
                sessionStorage.setItem('token', token);
            }
        } catch (e) {
            console.error(e)
        }
    };

  return (
    <div className="Auth-form-container">
        <form className="Auth-form">
            <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign Up</h3>
                <div className="form-group mt-3">
                    <label>Username</label>
                    <input
                        type="username"
                        className="form-control mt-1"
                        id="username"
                        name="username"
                        placeholder="Username"
                        onChange={(e)=>setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control mt-1"
                        id="email-address"
                        name="email"
                        placeholder="Email address"
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control mt-1"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={ handleRegister }
                    >
                        Submit
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
  )
}

export default SignUp
