import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

const SignIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            //! call link
            const response = await axios.post('http://localhost:5000/sign_in', {
                username: username,
                password: password
            })
            const { token } = response.data

            if (token) {
                //! call link
                await axios.post('http://localhost:5000/', { username: username })
                navigate('/')
                sessionStorage.setItem('token', token);
            }
            //!REFACTOR DUPLICATE in SIGN_UP
        } catch (e) {
            console.error('Error message: ', e)
            //! Call it from utilities/index.js
            toast.error('Wrong username/password', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return(
        <>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                                type="username"
                                className="form-control mt-1"
                                id="username"
                                name="username"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={ handleLogin }
                            >
                                Submit
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
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </>
    )
}

export default SignIn
