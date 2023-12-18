import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/en-au'

const Dashboard = () => {
    const [users, setUsers] = useState([])
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    const navigate = useNavigate();
    const token = sessionStorage.getItem('token')

    const getUsers = async (token) => {
        try {
            //!Call link
            const response = await axios.get('http://localhost:5000/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data)
        } catch (e) {
            console.error('Error message: ', e)
        }
    }

    const deleteUser = async () => {
        try {
            //!Call link
            await axios.post('http://localhost:5000/', { selectedIds: isCheck });
        } catch (error) {
          console.error('Error removing users:', error);
        }
    };

    const blockUser = async () => {
        try {
            //!Call link
            await axios.post('http://localhost:5000/block', { selectedIds: isCheck });
        } catch (error) {
          console.error('Error removing users:', error);
        }
    };

    const unblockUser = async () => {
        try {
            //!Call link
            await axios.post('http://localhost:5000/unblock', { selectedIds: isCheck });
        } catch (error) {
          console.error('Error removing users:', error);
        }
    };

    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(users.map(user => user._id));
        if (isCheckAll) {
          setIsCheck([]);
        }
    };

    const handleCheckbox = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
          setIsCheck(isCheck.filter(item => item !== id));
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/sign_in')
        }
    }, [token]);
//! REFACTOR useEffects
//! get users calls two times
    useEffect(() => {
        getUsers(token)
    }, [])

    return (
        //! DEcompostie table
        <div className='container pt-4'>
            <div className='d-flex mb-2 flex-row-reverse'>
                <button
                    className='btn btn-outline-danger ms-2'
                    onClick={deleteUser}
                >
                    <i className="bi bi-trash3"></i>
                </button>
                <button
                    className='btn btn-outline-secondary ms-2'
                    onClick={blockUser}
                >
                    <i className="bi bi-lock"></i>
                </button>
                <button
                    className='btn btn-outline-success'
                    onClick={unblockUser}
                >
                    <i className="bi bi-unlock"></i>
                </button>
            </div>
            <table className="table table-striped table-bordered">
                <thead className='table-dark'>
                    <tr>
                        <th className='text-center'>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={ isCheckAll }
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
                            <td className='text-center'>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
                {/* <tfoot>
                    pagination
                </tfoot> */}
            </table>
        </div>
    )
}

export default Dashboard;
