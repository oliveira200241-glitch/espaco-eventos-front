const formulario =
    document.getElementById("formCadastro");


const btnCliente =
    document.getElementById("btnCliente");


const btnGestor =
    document.getElementById("btnGestor");


const mensagem =
    document.getElementById("mensagem");


let tipoUsuario = "CLIENTE";


/*
=========================================
CLIENTE
=========================================
*/

btnCliente.addEventListener(
    "click",
    function () {

        tipoUsuario = "CLIENTE";

        btnCliente.classList.add("ativo");

        btnGestor.classList.remove("ativo");

        mensagem.textContent = "";

    }
);


/*
=========================================
GESTOR
=========================================
*/

btnGestor.addEventListener(
    "click",
    function () {

        tipoUsuario = "GESTOR";

        btnGestor.classList.add("ativo");

        btnCliente.classList.remove("ativo");

        mensagem.textContent = "";

    }
);


/*
=========================================
CADASTRO
=========================================
*/

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nome =
            document.getElementById("nome")
                .value
                .trim();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const documento =
            document.getElementById("documento")
                .value
                .trim();


        const telefone =
            document.getElementById("telefone")
                .value
                .trim();


        const senha =
            document.getElementById("senha")
                .value;


        const confirmarSenha =
            document.getElementById("confirmarSenha")
                .value;


        /*
        Verifica senha
        */

        if (senha !== confirmarSenha) {

            mensagem.textContent =
                "As senhas não são iguais.";

            mensagem.className =
                "mensagem erro";

            return;

        }


        /*
        Objeto enviado para o backend
        */

        const usuario = {

            nome: nome,

            email: email,

            senha: senha,

            telefone: telefone,

            documento: documento,

            tipo: tipoUsuario

        };


        mensagem.textContent =
            "Criando sua conta...";

        mensagem.className =
            "mensagem";


        try {

            const resposta =
                await fetch(
                    "http://localhost:8080/usuarios",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(usuario)

                    }
                );


            const texto =
                await resposta.text();


            if (!resposta.ok) {

                throw new Error(
                    texto ||
                    "Não foi possível criar a conta."
                );

            }


            /*
            Cadastro realizado
            */

            mensagem.textContent =
                "Conta criada com sucesso!";

            mensagem.className =
                "mensagem sucesso";


            /*
            Depois de 1 segundo,
            volta para o login.
            */

            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1000
            );


        } catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );


            mensagem.textContent =
                erro.message ||
                "Erro ao criar a conta.";

            mensagem.className =
                "mensagem erro";

        }

    }
);