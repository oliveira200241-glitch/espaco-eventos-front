const detalhesEspaco =
    document.getElementById("detalhesEspaco");

const mensagem =
    document.getElementById("mensagem");

const nomeUsuario =
    document.getElementById("nomeUsuario");

const btnSair =
    document.getElementById("btnSair");


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


/*
 * Recupera os dados do usuário.
 */

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

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
        "index.html";

}


/*
 * Recupera o ID do espaço
 * pela URL.
 *
 * Exemplo:
 *
 * detalhes-espaco.html?id=123
 */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const espacoId =
    parametros.get("id");


if (!espacoId) {

    mostrarErro(
        "Espaço não informado.",
        "Volte para a página de espaços e escolha um espaço."
    );

} else {

    carregarEspaco();

}



/*
 * Busca o espaço no backend.
 */

async function carregarEspaco() {

    try {

        const resposta =
            await fetch(
                `http://localhost:8080/espacos/${encodeURIComponent(espacoId)}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        if (resposta.status === 401) {

            fazerLogout();

            return;

        }


        if (resposta.status === 404) {

            mostrarErro(
                "Espaço não encontrado.",
                "Esse espaço pode ter sido removido ou não existe mais."
            );

            return;

        }


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o espaço."
            );

        }


        const espaco =
            await resposta.json();


        mostrarEspaco(espaco);


    } catch (erro) {

        console.error(
            "Erro ao carregar espaço:",
            erro
        );

        mostrarErro(
            "Não foi possível carregar este espaço.",
            "Verifique se o servidor está funcionando e tente novamente."
        );

    }

}



/*
 * Monta a página do espaço.
 */

function mostrarEspaco(espaco) {

    const disponivel =
        espaco.disponibilidade !== false;


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


    const descricao =
        espaco.descricao
        || "Este espaço está disponível para a realização de eventos.";


    const mensagemPerfil =
        usuario.tipo === "GESTOR"

            ? `
                <strong>
                    Área do Gestor
                </strong>

                <span>
                    Como gestor, você também pode reservar
                    espaços para seus próprios eventos.
                </span>
              `

            : `
                <strong>
                    Planeje seu próximo evento
                </strong>

                <span>
                    Escolha a data e o horário que deseja
                    e faça sua reserva de forma simples e segura.
                </span>
              `;


    detalhesEspaco.innerHTML = `

        <section class="espaco-destaque">

            <div class="espaco-imagem-grande">

                <div class="icone-espaco-grande">
                    ES
                </div>

                ${
                    disponivel
                    ? `
                        <span class="status-espaco disponivel">
                            Disponível
                        </span>
                      `
                    : `
                        <span class="status-espaco indisponivel">
                            Indisponível
                        </span>
                      `
                }

            </div>


            <div class="espaco-informacoes">

                <span class="tipo-espaco">
                    ${escaparHTML(tipo)}
                </span>


                <h1>
                    ${escaparHTML(
                        espaco.nome
                        || "Espaço sem nome"
                    )}
                </h1>


                <p class="descricao-detalhes">

                    ${escaparHTML(descricao)}

                </p>


                <div class="informacoes-grid">


                    <div class="informacao-item">

                        <span class="informacao-icone">
                            👥
                        </span>

                        <div>

                            <small>
                                Capacidade
                            </small>

                            <strong>
                                ${capacidade} pessoas
                            </strong>

                        </div>

                    </div>


                    <div class="informacao-item">

                        <span class="informacao-icone">
                            📍
                        </span>

                        <div>

                            <small>
                                Localização
                            </small>

                            <strong>
                                ${escaparHTML(endereco)}
                            </strong>

                        </div>

                    </div>


                    <div class="informacao-item">

                        <span class="informacao-icone">
                            💰
                        </span>

                        <div>

                            <small>
                                Valor
                            </small>

                            <strong>
                                ${preco}
                            </strong>

                        </div>

                    </div>


                    <div class="informacao-item">

                        <span class="informacao-icone">
                            📅
                        </span>

                        <div>

                            <small>
                                Reserva
                            </small>

                            <strong>
                                Por dia
                            </strong>

                        </div>

                    </div>


                </div>


                <div class="mensagem-perfil">

                    <div class="mensagem-perfil-icone">
                        ✦
                    </div>

                    <div>

                        ${mensagemPerfil}

                    </div>

                </div>


            </div>

        </section>



        <section class="reserva-card">

            <div class="reserva-header">

                <span class="section-tag">
                    RESERVA
                </span>

                <h2>
                    Reserve este espaço
                </h2>

                <p>
                    Informe a data e o horário desejados.
                    A disponibilidade será verificada automaticamente.
                </p>

            </div>


            ${
                disponivel

                ? `

                    <form
                        id="formReserva"
                        class="form-reserva"
                    >


                        <div class="campo-reserva">

                            <label for="data">
                                Data do evento
                            </label>

                            <input
                                type="date"
                                id="data"
                                required
                            >

                        </div>


                        <div class="horarios-reserva">


                            <div class="campo-reserva">

                                <label for="horarioInicio">
                                    Horário de início
                                </label>

                                <input
                                    type="time"
                                    id="horarioInicio"
                                    required
                                >

                            </div>


                            <div class="campo-reserva">

                                <label for="horarioFim">
                                    Horário de término
                                </label>

                                <input
                                    type="time"
                                    id="horarioFim"
                                    required
                                >

                            </div>


                        </div>


                        <div class="aviso-reserva">

                            <span>
                                🔒
                            </span>

                            <p>
                                Sua reserva será registrada como
                                <strong>PENDENTE</strong> e a disponibilidade
                                do espaço será validada pelo sistema.
                            </p>

                        </div>


                        <button
                            type="submit"
                            class="btn-principal btn-reservar"
                        >

                            <span>
                                Fazer reserva
                            </span>

                            <strong>
                                →
                            </strong>

                        </button>


                    </form>

                  `

                : `

                    <div class="reserva-indisponivel">

                        <div class="reserva-indisponivel-icone">
                            !
                        </div>

                        <h3>
                            Espaço indisponível
                        </h3>

                        <p>
                            No momento não é possível realizar
                            uma reserva neste espaço.
                        </p>

                    </div>

                  `
            }


        </section>

    `;


    if (disponivel) {

        configurarFormularioReserva();

    }

}



/*
 * Configura o formulário.
 */

function configurarFormularioReserva() {

    const formulario =
        document.getElementById("formReserva");


    const campoData =
        document.getElementById("data");


    /*
     * Impede selecionar datas passadas
     * no calendário.
     */

    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    campoData.min =
        `${ano}-${mes}-${dia}`;


    formulario.addEventListener(
        "submit",
        realizarReserva
    );

}



/*
 * Envia a reserva para o backend.
 */

async function realizarReserva(event) {

    event.preventDefault();


    const data =
        document.getElementById("data").value;


    const horarioInicio =
        document.getElementById("horarioInicio").value;


    const horarioFim =
        document.getElementById("horarioFim").value;


    if (!data || !horarioInicio || !horarioFim) {

        mostrarMensagem(
            "Preencha todos os campos da reserva.",
            "erro"
        );

        return;

    }


    if (horarioInicio >= horarioFim) {

        mostrarMensagem(
            "O horário de início deve ser anterior ao horário de término.",
            "erro"
        );

        return;

    }


    /*
     * O backend não precisa receber
     * usuarioId.
     *
     * Ele pega o usuário autenticado
     * através do JWT.
     */

    const reserva = {

        espacoId: espacoId,

        data: data,

        horarioInicio:
            horarioInicio + ":00",

        horarioFim:
            horarioFim + ":00"

    };


    const botao =
        document.querySelector(
            ".btn-reservar"
        );


    botao.disabled = true;

    botao.innerHTML = `
        <span>
            Verificando disponibilidade...
        </span>
    `;


    try {

        const resposta =
            await fetch(
                "http://localhost:8080/reservas",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body:
                        JSON.stringify(reserva)

                }
            );


        if (resposta.status === 401) {

            fazerLogout();

            return;

        }


        const texto =
            await resposta.text();


        let dados = null;


        try {

            dados =
                texto
                ? JSON.parse(texto)
                : null;

        } catch {

            dados = null;

        }


        if (!resposta.ok) {

            const erro =
                dados?.mensagem
                || dados?.erro
                || texto
                || "Não foi possível realizar a reserva.";

            throw new Error(erro);

        }


        mostrarMensagem(
            "Reserva realizada com sucesso! Sua solicitação está pendente de confirmação.",
            "sucesso"
        );


        botao.innerHTML = `
            <span>
                Reserva realizada ✓
            </span>
        `;


        setTimeout(
            function () {

                window.location.href =
                    "minhas-reservas.html";

            },
            1800
        );


    } catch (erro) {

        console.error(
            "Erro ao realizar reserva:",
            erro
        );


        mostrarMensagem(
            erro.message
            || "Erro ao realizar reserva.",
            "erro"
        );


        botao.disabled = false;

        botao.innerHTML = `
            <span>
                Fazer reserva
            </span>

            <strong>
                →
            </strong>
        `;

    }

}



/*
 * Mensagem de erro geral.
 */

function mostrarErro(
    titulo,
    descricao
) {

    detalhesEspaco.innerHTML = `

        <div class="estado-vazio">

            <div class="estado-icone">
                !
            </div>

            <h3>
                ${escaparHTML(titulo)}
            </h3>

            <p>
                ${escaparHTML(descricao)}
            </p>

            <a
                href="espacos.html"
                class="btn-tentar"
            >
                Voltar para espaços
            </a>

        </div>

    `;

}



/*
 * Mostra mensagens do formulário.
 */

function mostrarMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;

    mensagem.className =
        `mensagem ${tipo}`;

}



/*
 * Formata preço em reais.
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
 * Evita HTML malicioso
 * vindo do backend.
 */

function escaparHTML(valor) {

    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

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


btnSair.addEventListener(
    "click",
    fazerLogout
);