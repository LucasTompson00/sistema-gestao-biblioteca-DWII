const URL_API = "https://openlibrary.org/search.json";

export async function buscarLivroPorIsbn(isbn) {
  const isbnLimpo = String(isbn).replace(/[-\s]/g, "");

  if (!isbnLimpo) {
    throw new Error("Informe um ISBN para realizar a busca.");
  }

  const parametros = new URLSearchParams({
    q: `isbn:${isbnLimpo}`,
    fields:
      "title,author_name,first_publish_year,cover_i,first_sentence,subject",
    limit: "1",
  });

  const resposta = await fetch(`${URL_API}?${parametros.toString()}`);

  if (!resposta.ok) {
    throw new Error("Não foi possível consultar a Open Library.");
  }

  const resultado = await resposta.json();
  const livro = resultado.docs?.[0];

  if (!livro) {
    throw new Error("Nenhum livro encontrado com esse ISBN.");
  }

  let sinopse = livro.first_sentence || "";

  if (Array.isArray(sinopse)) {
    sinopse = sinopse
      .map((item) => (typeof item === "string" ? item : item?.value || ""))
      .filter(Boolean)
      .join(" ");
  } else if (typeof sinopse === "object") {
    sinopse = sinopse?.value || "";
  }

  return {
    titulo: livro.title || "",
    sinopse,
    capa: livro.cover_i
      ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
      : "",
    ano_publicacao: livro.first_publish_year
      ? String(livro.first_publish_year)
      : "",
    autores: livro.author_name || [],
    assuntos: livro.subject || [],
  };
}
