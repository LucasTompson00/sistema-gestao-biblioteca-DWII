
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./pages/Home"
import Login from "./pages/Login"
import CadastroLivro from "./pages/CadastroLivro"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/cadastro-livro" element={<CadastroLivro />} />

                {/* Acesso temporário sem autenticação */}
                <Route path="/" element={<Home />} />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
