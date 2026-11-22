import api from "./client";

export async function listarEmprestimos() {
    const { data } = await api.get("/emprestimos");
    return data;
}

export async function registrarEmprestimo(dados) {
    const { data } = await api.post("/emprestimos", dados);
    return data;
}

export async function atualizarEmprestimo(id, dados) {
    const { data } = await api.patch(`/emprestimos/${id}`, dados);
    return data;
}

export async function devolverEmprestimo(id) {
    const { data } = await api.patch(`/emprestimos/${id}/devolucao`);
    return data;
}

export async function excluirEmprestimo(id) {
    await api.delete(`/emprestimos/${id}`);
}
