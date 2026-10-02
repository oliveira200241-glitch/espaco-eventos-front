const listaReservas =
    document.getElementById("listaReservas");

const contadorReservas =
    document.getElementById("contadorReservas");

const mensagem =
    document.getElementById("mensagem");

const nomeUsuario =
    document.getElementById("nomeUsuario");

const btnSair =
    document.getElementById("btnSair");

const btnAtualizarReservas =
    document.getElementById("btnAtualizarReservas");


const token =
    localStorage.getItem("token");

const usuarioSalvo =
    localStorage.getItem("usuario");


/*
 * Verifica se o usuário está logado.
 */
if (!token || !usuarioSalvo) {

    window.location.href =
        "index.html";
}


let usuario;

try {

    usuario =
        JSON.parse(usuarioSalvo);

    nomeUsuario.textContent =
        usuario.nome;

} catch (erro) {

    console.error(
        "Erro ao carregar usuário:",
        erro
    );

    fazerLogout();
}


/*
 * Carrega as reservas do usuário.
 */
async function carregarReservas() {

    listaReservas.innerHTML = `
        <div class="carregando">

            <div class="spinner"></div>

            <p>
                Carregando suas reservas...
            </p>

        </div>
    `;

    contadorReservas.textContent =
        "Buscando reservas...";

    mensagem.textContent = "";


    try {

        const resposta =
            await fetch(
                `http://localhost:8080/reservas/usuario/${encodeURIComponent(usuario.id)}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        /*
         * Token inválido ou expirado.
         */
        if (resposta.status === 401) {

            fazerLogout();

            return;
        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar suas reservas."
            );
        }


        const reservas =
            await resposta.json();


        mostrarReservas(reservas);

    } catch (erro) {

        console.error(
            "Erro ao carregar reservas:",
            erro
        );


        listaReservas.innerHTML = `
            <div class="estado-vazio">

                <div class="estado-icone">
                    !
                </div>

                <h3>
                    Não foi possível carregar suas reservas
                </h3>

                <p>
                    Verifique se o servidor está funcionando
                    e tente novamente.
                </p>

                <button
                    type="button"
                    onclick="carregarReservas()"
                    class="btn-tentar"
                >
                    Tentar novamente
                </button>

            </div>
        `;


        contadorReservas.textContent =
            "Erro ao carregar.";
    }
}


/*
 * Mostra as reservas na tela.
 */
async function mostrarReservas(reservas) {

    if (
        !Array.isArray(reservas)
        || reservas.length === 0
    ) {

        listaReservas.innerHTML = `
            <div class="estado-vazio">

                <div class="estado-icone">
                    📅
                </div>

                <h3>
                    Você ainda não possui reservas
                </h3>

                <p>
                    Explore nossos espaços e faça
                    sua primeira reserva.
                </p>

                <a
                    href="espacos.html"
                    class="btn-tentar"
                >
                    Explorar espaços
                </a>

            </div>
        `;


        contadorReservas.textContent =
            "Nenhuma reserva encontrada.";

        return;
    }


    contadorReservas.textContent =
        `${reservas.length} reserva(s) encontrada(s)`;


    listaReservas.innerHTML =
        `<div class="carregando">

            <div class="spinner"></div>

            <p>
                Carregando detalhes dos espaços...
            </p>

        </div>`;


    /*
     * Busca os dados dos espaços relacionados
     * às reservas.
     */
    const reservasComEspacos =
        await Promise.all(
            reservas.map(
                async function (reserva) {

                    try {

                        const resposta =
                            await fetch(
                                `http://localhost:8080/espacos/${encodeURIComponent(reserva.espacoId)}`,
                                {
                                    method: "GET",

                                    headers: {
                                        "Authorization":
                                            "Bearer " + token
                                    }
                                }
                            );


                        if (!resposta.ok) {

                            return {
                                reserva: reserva,
                                espaco: null
                            };
                        }


                        const espaco =
                            await resposta.json();


                        return {
                            reserva: reserva,
                            espaco: espaco
                        };

                    } catch (erro) {

                        console.error(
                            "Erro ao buscar espaço:",
                            erro
                        );

                        return {
                            reserva: reserva,
                            espaco: null
                        };
                    }
                }
            )
        );


    listaReservas.innerHTML =
        reservasComEspacos
            .map(criarCardReserva)
            .join("");
}


/*
 * Cria o card visual de uma reserva.
 */
function criarCardReserva(item) {

    const reserva =
        item.reserva;

    const espaco =
        item.espaco;


    const nomeEspaco =
        espaco?.nome
        || "Espaço não encontrado";


    const endereco =
        espaco?.endereco
        || "Endereço não informado";


    const preco =
        espaco
        ? formatarPreco(espaco.preco)
        : "Preço não informado";


    const status =
        reserva.status
        || "PENDENTE";


    const classeStatus =
        obterClasseStatus(status);


    const textoStatus =
        formatarStatus(status);


    const data =
        formatarData(reserva.data);


    const horario =
        formatarHorario(
            reserva.horarioInicio,
            reserva.horarioFim
        );


    return `
        <article class="card-reserva">

            <div class="icone-card-reserva">
                ES
            </div>


            <div class="info-card-reserva">

                <div class="topo-card-reserva">

                    <div>

                        <span class="tipo-espaco">
                            RESERVA
                        </span>

                        <h3>
                            ${escaparHTML(nomeEspaco)}
                        </h3>

                    </div>


                    <span
                        class="status-reserva ${classeStatus}"
                    >
                        ${textoStatus}
                    </span>

                </div>


                <div class="detalhes-reserva">

                    <div class="detalhe-reserva">

                        <span>
                            📅
                        </span>

                        <div>

                            <small>
                                Data
                            </small>

                            <strong>
                                ${data}
                            </strong>

                        </div>

                    </div>


                    <div class="detalhe-reserva">

                        <span>
                            🕐
                        </span>

                        <div>

                            <small>
                                Horário
                            </small>

                            <strong>
                                ${horario}
                            </strong>

                        </div>

                    </div>


                    <div class="detalhe-reserva">

                        <span>
                            📍
                        </span>

                        <div>

                            <small>
                                Local
                            </small>

                            <strong>
                                ${escaparHTML(endereco)}
                            </strong>

                        </div>

                    </div>


                    <div class="detalhe-reserva">

                        <span>
                            💰
                        </span>

                        <div>

                            <small>
                                Valor do espaço
                            </small>

                            <strong>
                                ${preco}
                            </strong>

                        </div>

                    </div>

                </div>


                <div class="rodape-reserva">

                    <span>
                        Solicitação registrada
                    </span>

                    <button
                        type="button"
                        class="btn-detalhes-reserva"
                        onclick="abrirEspaco('${reserva.espacoId}')"
                    >
                        Ver espaço →
                    </button>

                </div>

            </div>

        </article>
    `;
}


/*
 * Abre novamente os detalhes do espaço.
 */
function abrirEspaco(id) {

    window.location.href =
        `detalhes-espaco.html?id=${encodeURIComponent(id)}`;
}


/*
 * Converte o status do banco para
 * uma classe CSS.
 */
function obterClasseStatus(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "CONFIRMADA":
            return "status-confirmada";

        case "CANCELADA":
            return "status-cancelada";

        case "PENDENTE":
        default:
            return "status-pendente";
    }
}


/*
 * Texto amigável para o status.
 */
function formatarStatus(status) {

    switch (
        String(status).toUpperCase()
    ) {

        case "CONFIRMADA":
            return "Confirmada";

        case "CANCELADA":
            return "Cancelada";

        case "PENDENTE":
        default:
            return "Pendente";
    }
}


/*
 * Formata a data recebida pelo backend.
 */
function formatarData(data) {

    if (!data) {

        return "Data não informada";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/*
 * Formata o horário.
 */
function formatarHorario(
    inicio,
    fim
) {

    if (!inicio || !fim) {

        return "Horário não informado";
    }


    return `${inicio.substring(0, 5)} às ${fim.substring(0, 5)}`;
}


/*
 * Formata preço.
 */
function formatarPreco(preco) {

    if (
        preco === null
        || preco === undefined
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
 * Evita inserir HTML vindo da API.
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
 * Logout.
 */
function fazerLogout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "index.html";
}


/*
 * Botões.
 */
btnSair.addEventListener(
    "click",
    fazerLogout
);


btnAtualizarReservas.addEventListener(
    "click",
    carregarReservas
);


/*
 * Inicializa a página.
 */
carregarReservas();