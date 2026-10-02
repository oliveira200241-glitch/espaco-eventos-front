const formularioLogin =
    document.getElementById("loginForm");

const btnCliente =
    document.getElementById("btnCliente");

const btnGestor =
    document.getElementById("btnGestor");

const identificador =
    document.getElementById("identificador");

const labelIdentificador =
    document.getElementById("labelIdentificador");

const mensagem =
    document.getElementById("mensagem");


/*
=========================================
TIPO DE USUÁRIO
=========================================
*/

let tipoUsuario = "CLIENTE";


/*
=========================================
BOTÃO CLIENTE
=========================================
*/

btnCliente.addEventListener("click", function () {

    tipoUsuario = "CLIENTE";

    btnCliente.classList.add("ativo");

    btnGestor.classList.remove("ativo");


    labelIdentificador.textContent =
        "E-mail";


    identificador.type =
        "email";


    identificador.placeholder =
        "Digite seu e-mail";


    identificador.value = "";


    mensagem.textContent = "";

});


/*
=========================================
BOTÃO GESTOR
=========================================
*/

btnGestor.addEventListener("click", function () {

    tipoUsuario = "GESTOR";

    btnGestor.classList.add("ativo");

    btnCliente.classList.remove("ativo");


    labelIdentificador.textContent =
        "CPF/CNPJ";


    identificador.type =
        "text";


    identificador.placeholder =
        "Digite seu CPF ou CNPJ";


    identificador.value = "";


    mensagem.textContent = "";

});


/*
=========================================
LOGIN
=========================================
*/

formularioLogin.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const valorIdentificador =
            identificador.value.trim();


        const senha =
            document.getElementById("senha").value;


        mensagem.textContent =
            "Entrando...";

        mensagem.className =
            "mensagem";


        /*
        Dados enviados para o backend
        */

        const dadosLogin = {

            identificador:
                valorIdentificador,

            senha:
                senha

        };


        try {

            const resposta =
                await fetch(
                    "https://espaco-eventos-api.onrender.com/usuarios/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                dadosLogin
                            )

                    }
                );


            /*
            Tenta ler a resposta
            */

            const dados =
                await resposta.json();


            /*
            Login recusado
            */

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Usuário ou senha inválidos!"
                );

            }


            /*
            Confere o tipo da conta
            */

            if (
                dados.usuario.tipo !==
                tipoUsuario
            ) {

                throw new Error(
                    "Esta conta não pertence ao tipo selecionado."
                );

            }


            /*
            Salva JWT
            */

            localStorage.setItem(
                "token",
                dados.token
            );


            /*
            Salva usuário
            */

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    dados.usuario
                )
            );


            console.log(
                "Login realizado:",
                dados.usuario
            );


            /*
            Mensagem de sucesso
            */

            mensagem.textContent =
                "Login realizado com sucesso!";

            mensagem.classList.add(
                "sucesso"
            );


            /*
            Aguarda um pouco e vai
            para a próxima tela.
            */

            setTimeout(function () {

                window.location.href =
                    "espacos.html";

            }, 700);


        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            mensagem.textContent =
                erro.message ||
                "Erro ao realizar login.";


            mensagem.classList.add(
                "erro"
            );

        }

    }
);