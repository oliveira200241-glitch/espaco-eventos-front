const listaEspacos =
    document.getElementById("listaEspacos");

const contadorEspacos =
    document.getElementById("contadorEspacos");

const mensagem =
    document.getElementById("mensagem");

const nomeUsuario =
    document.getElementById("nomeUsuario");

const btnSair =
    document.getElementById("btnSair");

const btnAtualizar =
    document.getElementById("btnAtualizar");


/*
=========================================
VERIFICAR LOGIN
=========================================
*/

const token =
    localStorage.getItem("token");

const usuarioSalvo =
    localStorage.getItem("usuario");


if (!token || !usuarioSalvo) {

    window.location.href =
        "index.html";

}


/*
=========================================
MOSTRAR USUÁRIO
=========================================
*/

try {

    const usuario =
        JSON.parse(usuarioSalvo);

    nomeUsuario.textContent =
        usuario.nome;

} catch (erro) {

    console.error(
        "Erro ao carregar usuário:",
        erro
    );

}


/*
=========================================
CARREGAR ESPAÇOS
=========================================
*/

async function carregarEspacos() {

    listaEspacos.innerHTML = `

        <div class="carregando">

            <div class="spinner"></div>

            <p>
                Carregando espaços...
            </p>

        </div>

    `;

    contadorEspacos.textContent =
        "Buscando espaços...";


    mensagem.textContent = "";


    try {

        const resposta =
            await fetch(
                "https://espaco-eventos-api.onrender.com/espacos",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (!resposta.ok) {

            if (resposta.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "usuario"
                );

                window.location.href =
                    "index.html";

                return;

            }

            throw new Error(
                "Não foi possível carregar os espaços."
            );

        }


        const espacos =
            await resposta.json();


        mostrarEspacos(espacos);


    } catch (erro) {

        console.error(
            "Erro ao carregar espaços:",
            erro
        );


        listaEspacos.innerHTML = `

            <div class="estado-vazio">

                <div class="estado-icone">
                    !
                </div>

                <h3>
                    Não foi possível carregar os espaços
                </h3>

                <p>
                    Verifique se o servidor está funcionando
                    e tente novamente.
                </p>

                <button
                    type="button"
                    onclick="carregarEspacos()"
                    class="btn-tentar"
                >
                    Tentar novamente
                </button>

            </div>

        `;

        contadorEspacos.textContent =
            "Erro ao carregar.";

    }

}


/*
=========================================
MOSTRAR ESPAÇOS
=========================================
*/

function mostrarEspacos(espacos) {

    if (!Array.isArray(espacos)
        || espacos.length === 0) {

        listaEspacos.innerHTML = `

            <div class="estado-vazio">

                <div class="estado-icone">
                    +
                </div>

                <h3>
                    Nenhum espaço encontrado
                </h3>

                <p>
                    Ainda não existem espaços
                    cadastrados no sistema.
                </p>

            </div>

        `;

        contadorEspacos.textContent =
            "Nenhum espaço disponível.";

        return;

    }


    const espacosDisponiveis =
        espacos.filter(
            espaco =>
                espaco.disponibilidade !== false
        );


    contadorEspacos.textContent =
        `${espacosDisponiveis.length} espaço(s) disponível(is)`;


    if (espacosDisponiveis.length === 0) {

        listaEspacos.innerHTML = `

            <div class="estado-vazio">

                <div class="estado-icone">
                    !
                </div>

                <h3>
                    Nenhum espaço disponível
                </h3>

                <p>
                    Os espaços cadastrados estão
                    indisponíveis no momento.
                </p>

            </div>

        `;

        return;

    }


    listaEspacos.innerHTML =
        espacosDisponiveis
            .map(criarCardEspaco)
            .join("");

}


/*
=========================================
CRIAR CARD
=========================================
*/

function criarCardEspaco(espaco) {

    const preco =
        formatarPreco(espaco.preco);


    const capacidade =
        espaco.capacidade
        ?? "Não informada";


    const tipo =
        espaco.tipo
        || "Espaço para eventos";


    const endereco =
        espaco.endereco
        || "Endereço não informado";


    return `

        <article class="card-espaco">

            <div class="imagem-espaco">

                <div class="icone-espaco">
                    ES
                </div>

                <span class="disponivel">
                    Disponível
                </span>

            </div>


            <div class="info-espaco">

                <span class="tipo-espaco">
                    ${escaparHTML(tipo)}
                </span>


                <h3>
                    ${escaparHTML(
                        espaco.nome
                        || "Espaço sem nome"
                    )}
                </h3>


                <p class="descricao-espaco">

                    ${escaparHTML(
                        espaco.descricao
                        || "Espaço disponível para eventos."
                    )}

                </p>


                <div class="detalhes-espaco">

                    <span>
                        👥
                        ${capacidade}
                        pessoas
                    </span>

                    <span>
                        📍
                        ${escaparHTML(endereco)}
                    </span>

                </div>


                <div class="rodape-card">

                    <div>

                        <small>
                            A partir de
                        </small>

                        <strong>
                            ${preco}
                        </strong>

                        <small>
                            / dia
                        </small>

                    </div>


                    <button
                        type="button"
                        class="btn-ver-espaco"
                        onclick="abrirEspaco('${espaco.id}')"
                    >
                        Ver espaço →
                    </button>

                </div>

            </div>

        </article>

    `;

}


/*
=========================================
ABRIR ESPAÇO
=========================================
*/

function abrirEspaco(id) {

    window.location.href =
        `detalhes-espaco.html?id=${encodeURIComponent(id)}`;

}


/*
=========================================
FORMATAR PREÇO
=========================================
*/

function formatarPreco(preco) {

    if (
        preco === null ||
        preco === undefined
    ) {

        return "Preço não informado";

    }


    return Number(preco).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/*
=========================================
EVITAR HTML INJETADO
=========================================
*/

function escaparHTML(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*
=========================================
SAIR
=========================================
*/

btnSair.addEventListener(
    "click",
    function () {

        localStorage.removeItem("token");

        localStorage.removeItem("usuario");

        window.location.href =
            "index.html";

    }
);


/*
=========================================
ATUALIZAR
=========================================
*/

btnAtualizar.addEventListener(
    "click",
    carregarEspacos
);


/*
=========================================
INICIAR
=========================================
*/

carregarEspacos();