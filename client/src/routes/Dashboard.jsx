import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from "mobx-react-lite"
import moment from 'moment'
import 'moment/locale/en-au'

import { Context } from '../index'
import UserService from "../services/UserService"


const Dashboard = () => {
    const [users, setUsers] = useState([])
    const [isSelectedAll, setIsSelectedAll] = useState(false)
    const [isCheck, setIsCheck] = useState([])

    const navigate = useNavigate()
    const { store } = useContext(Context)
    const token = sessionStorage.getItem('token')

    useEffect(() => {
        getUsers()

        if (token) {
            store.checkAuth()
        }
    }, [])

    const resetCheckboxes = () => {
        setIsCheck([])
        setIsSelectedAll(false)
    }

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers(token)
            setUsers(response.data)
            resetCheckboxes()
        } catch (e) {
            console.error('Error fetching users: ', e)
        }
    }

    const deleteUser = async () => {
        try {
            await UserService.deleteUsers(isCheck)

            if (isCheck.includes(store.user.id)) {
                await store.logout()
                    .then(() => navigate('/'))
            }

            getUsers()
        } catch (error) {
            console.error('Error removing users:', error)
        }
    }

    const blockUser = async () => {
        try {
            await UserService.blockUsers(isCheck)

            if (isCheck.includes(store.user.id)) {
                await store.logout()
                    .then(() => navigate('/'))
            }

            getUsers()
        } catch (error) {
          console.error('Error removing users:', error)
        }
    }

    const unblockUser = async () => {
        try {
            await UserService.unblockUsers(isCheck)
            getUsers()
        } catch (error) {
          console.error('Error removing users:', error)
        }
    }

    const logout = async () => {
        await store.logout()
            .then(() => navigate('/'))
    }

    const handleSelectAll = e => {
        setIsSelectedAll(!isSelectedAll)
        setIsCheck(users.map(user => user._id))
        if (isSelectedAll) {
          setIsCheck([])
        }
    }

    const handleCheckbox = e => {
        const { id, checked } = e.target
        setIsCheck([...isCheck, id])
        if (!checked) {
          setIsCheck(isCheck.filter(item => item !== id))
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/sign_in')
        }
    }, [token])

//! REFACTOR useEffects
    return (
        //! DEcompostie table
        <div className='container pt-4'>
            <div className='d-flex mb-2 justify-content-between align-items-center'>
                <button
                    className='btn btn-outline-danger py-1 ms-2'
                    onClick={logout}
                >
                    Logout
                </button>
                <div className='d-flex mb-2'>
                    <button
                        className='btn btn-outline-success'
                        onClick={unblockUser}
                    >
                        <i className="bi bi-unlock"></i>
                    </button>
                    <button
                        className='btn btn-outline-secondary ms-2'
                        onClick={blockUser}
                    >
                        <i className="bi bi-lock"></i>
                    </button>
                    <button
                        className='btn btn-outline-danger ms-2'
                        onClick={deleteUser}
                    >
                        <i className="bi bi-trash3"></i>
                    </button>
                </div>
            </div>
            <table className="table table-striped table-bordered">
                <thead className='table-dark'>
                    <tr>
                        <th className='text-center'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={ isSelectedAll }
                                onChange={ handleSelectAll }
                            />
                        </th>
                        <th scope="col" className='text-center'>#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Registration date</th>
                        <th scope="col">Last login date</th>
                        <th scope="col" className='text-center'>Status</th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {users.map((user, i) => (
                        <tr key={user._id}>
                            <th className='text-center'>
                                <input
                                    type='checkbox'
                                    id={user._id}
                                    checked={isCheck.includes(user._id)}
                                    onChange={ handleCheckbox }
                                    className="form-check-input"
                                />
                            </th>
                            <th scope="row" className='text-center'>{++i}</th>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{moment(user.createdAt).format('L')}</td>
                            <td>{moment(user.lastLogin).format('LLL')}</td>
                            <td className='text-center'>{user.isBlocked ? 'BLOCKED' : 'ACTIVE'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default observer(Dashboard)
