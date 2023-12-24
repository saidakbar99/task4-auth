import { useState, useContext, useEffect } from "react"

import { Context } from "./index"
import SignIn from "./routes/SignIn"
import UserService from "./services/UserService"

const App = () => {
    const { store } = useContext(Context)
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <SignIn/>
            </div>
        )
    }

    return (
        <div>
            <SignIn />
        </div>
    )
}

export default App
