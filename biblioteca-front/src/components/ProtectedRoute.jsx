import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8000/me", {
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                setAuthenticated(response.ok)
            })
            .catch(() => {
                setAuthenticated(false)
            })
    }, [])

    if (authenticated === null) {
        return <p>Verificando sessão...</p>
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute