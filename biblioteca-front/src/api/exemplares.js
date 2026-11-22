import api from "./client";

export async function listarExemplares() {
    const { data } = await api.get("/exemplares");
    return data;
}

export async function cadastrarExemplar(dados) {
    const { data } = await api.post("/exemplares", dados);
    return data;
}

export async function atualizarExemplar(id, dados) {
    const { data } = await api.put(`/exemplares/${id}`, dados);
    return data;
}

export async function excluirExemplar(id) {
    await api.delete(`/exemplares/${id}`);
}
