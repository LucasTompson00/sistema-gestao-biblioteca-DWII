import api from "./client";

export async function listarExemplares() {
    const { data } = await api.get("/exemplares");
    return data;
}

export async function buscarExemplar(id) {
    const { data } = await api.get(`/exemplares/${id}`);
    return data;
}
