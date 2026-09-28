import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:8000"

function Home() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)

        try {
            const csrfResponse = await fetch(`${API_URL}/csrf-token`, {
                credentials: "include",
            })

            const csrfData = await csrfResponse.json()

            const logoutResponse = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": csrfData.token,
                },
            })

            if (!logoutResponse.ok) {
                throw new Error("Não foi possível sair da conta.")
            }

            navigate("/login", { replace: true })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>Biblioteca</h1>
            <p>Login realizado com sucesso.</p>

            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
            >
                {loading ? "Saindo..." : "Sair"}
            </button>
        </main>
    )
}

export default Home