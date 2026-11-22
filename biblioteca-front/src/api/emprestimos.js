import api from "./client";

export async function listarEmprestimos() {
    const { data } = await api.get("/emprestimos");
    return data;
}

export async function buscarEmprestimo(id) {
    const { data } = await api.get(`/emprestimos/${id}`);
    return data;
}

export async function cadastrarEmprestimo(dados) {
    const { data } = await api.post("/emprestimos", dados);
    return data;
}

export async function atualizarEmprestimo(id, dados) {
    const { data } = await api.put(`/emprestimos/${id}`, dados);
    return data;
}

export async function excluirEmprestimo(id) {
    await api.delete(`/emprestimos/${id}`);
}
