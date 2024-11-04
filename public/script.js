async function cadastrar_cl() {
    const na_cl = document.getElementById("name_cl").value;
    const email_cl = document.getElementById("email_cl").value;
    const phone_cl = document.getElementById("phone_cl").value;
    const phoneType_cl = document.getElementById("phoneType_cl").value;
    const address_cl = document.getElementById("address_cl").value;
    const Doc_cl = document.getElementById("Doc_cl").value;
    const tp_doc_cl = document.getElementById("tp_doc_cl").value;
    const codigo_cl = document.getElementById("codigo_cl").value;
    const estado_cl = document.getElementById("estado_cl").value;
    const cidade_cl = document.getElementById("cidade_cl").value;

    await fetch("/cadastrar_cl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            na_cl,
            email_cl,
            phone_cl,
            phoneType_cl,
            address_cl,
            Doc_cl,
            tp_doc_cl,
            codigo_cl,
            estado_cl,
            cidade_cl,
        }),
    });

    alert("Cliente cadastrado com sucesso!");
}

async function cadastrar_prod() {
    const desc = document.getElementById("descricao").value;
    const nome = document.getElementById("nome").value;
    const forn = document.getElementById("fornecedor").value;
    const codi = document.getElementById("codigo").value;
    const unid = document.getElementById("unidade").value;
    const data = document.getElementById("data").value;
    const comp = document.getElementById("preco_compra").value;
    const vend = document.getElementById("preco_").value;
    const qnt_prod = document.getElementById("quantidade").value;
    const cod_fabr = document.getElementById("codigo_fabricante").value;

    await fetch("/cadastrar_prod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            desc,
            nome,
            forn,
            codi,
            unid,
            data,
            comp,
            vend,
            qnt_prod,
            cod_fabr
        }),
    });

    alert("Produto cadastrado com sucesso!");
}

async function cadastrar_fornecedor() {
    const nc = document.getElementById("nome_completo").value;
    const cnpj = document.getElementById("cnpj").value;
    const fabr = document.getElementById("fabricante").value;
    const end = document.getElementById("endereco").value;

    await fetch("/cadastrar_fornecedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nc, cnpj, fabr, end }),
    });

    alert("Fornecedor cadastrado com sucesso!");
}

async function cadastrar_funcionario() {
    const func_nm = document.getElementById("nome").value;
    const func_cpf = document.getElementById("cpf").value;
    const func_nasc = document.getElementById("data_nascimento").value;
    const func_muni = document.getElementById("municipio").value;
    const func_uf = document.getElementById("uf").value;
    const func_end = document.getElementById("endereco").value;
    const func_cep = document.getElementById("cep").value;
    const func_sex = document.getElementById("sexo").value;
    const func_pes = document.getElementById("peso").value;
    const func_grau = document.getElementById("grau_instrucao").value;
    const func_pis = document.getElementById("pis_pasep").value;
    const func_data_ad = document.getElementById("data_admissao").value;
    const func_cart = document.getElementById("carteira_trabalho").value;
    const func_serie = document.getElementById("serie").value;
    const func_set = document.getElementById("setor").value;

    await fetch("/cadastrar_funcionario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            func_nm,
            func_cpf,
            func_nasc,
            func_muni,
            func_uf,
            func_end,
            func_cep,
            func_sex,
            func_pes,
            func_grau,
            func_pis,
            func_data_ad,
            func_cart,
            func_serie,
            func_set,
        }),
    });

    alert("Funcionário cadastrado com sucesso!");
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("id_funcionario").value = gerarIdFuncionario();
});

async function cadastrar_quarto() {
    const num_q = document.getElementById("numero_quarto").value;
    const tp_quarto = document.getElementById("tipo_quarto").value;

    await fetch("/cadastrar_quarto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_q, tp_quarto }),
    });

    alert("Quarto cadastrado com sucesso!");
}

async function cadastrar_servico() {
    const nm_ser = document.getElementById("nome_servico").value;
    const qnt_ser = document.getElementById("quantidade").value;
    const tp_ser = document.getElementById("tipo_servico").value;
    const id_ser = document.getElementById("id_quarto").value;

    await fetch("/cadastrar_servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nm_ser, qnt_ser, tp_ser, id_ser }),
    });

    alert("Serviço cadastrado com sucesso!");
}

async function cadastrar_tipo_quarto() {
    const id_quarto = document.getElementById("id_quarto").value;
    const tp_qto = document.getElementById("tipo_quarto").value;
    const cara_quarto = document.getElementById("caracteristicas").value;
    const equi_quarto = document.getElementById("equipamentos").value;
    const qnt_itens = document.getElementById("quantidade_itens").value;
    const desc_quarto = document.getElementById("descricao").value;

    await fetch("/cadastrar_tipo_quarto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_quarto,
            tp_qto,
            cara_quarto,
            equi_quarto,
            qnt_itens,
            desc_quarto,
        }),
    });

    alert("Tipo de quarto cadastrado com sucesso!");
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("id_quarto").value = gerarIdQuarto();
});

async function cadastrar_ci() {
    const id_checkin = document.getElementById("id_cl").value;
    const n_quarto = document.getElementById("numero_quarto").value;
    const dt_en = document.getElementById("data_en").value;
    const dt_sa = document.getElementById("data_sa").value;
    const status = document.getElementById("st").value;

    await fetch("/cadastrar_ci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_checkin, n_quarto, dt_en, dt_sa, status }),
    });

    alert("Check-in cadastrado com sucesso!");
}
async function cadastrar_co() {
    const id_checkout = document.getElementById("id_cl").value;
    const n_quarto = document.getElementById("numero_quarto").value;
    const dt_en = document.getElementById("data_en").value;
    const dt_sa = document.getElementById("data_sa").value;
    const total = document.getElementById("tp").value;
    const status = document.getElementById("st").value;

    await fetch("/cadastrar_co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_checkout,
            n_quarto,
            dt_en,
            dt_sa,
            total,
            status
        }),
    });

    alert("Check-out cadastrado com sucesso!");
}
