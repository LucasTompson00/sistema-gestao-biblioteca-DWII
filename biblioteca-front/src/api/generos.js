import api from "./client";

export async function listarGeneros() {
    const { data } = await api.get("/generos");
    return data;
}

export async function cadastrarGenero(dados) {
    const { data } = await api.post("/generos", dados);
    return data;
}

export async function atualizarGenero(id, dados) {
    const { data } = await api.put(`/generos/${id}`, dados);
    return data;
}

export async function excluirGenero(id) {
    await api.delete(`/generos/${id}`);
}