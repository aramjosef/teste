const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('hotel.db');

// Criar as tabelas se não existirem
db.serialize(() => {
    // Criar a tabela clientes
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL,
            tipo_telefone TEXT NOT NULL,
            endereco TEXT NOT NULL,
            documento TEXT NOT NULL,
            tipo_documento TEXT NOT NULL,
            pais TEXT NOT NULL,
            estado TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela clientes:', err);
        } else {
            console.log('Tabela clientes criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela quartos
    db.run(`
        CREATE TABLE IF NOT EXISTS quartos (
            numero TEXT PRIMARY KEY UNIQUE,
            status TEXT NOT NULL,
            tipo_quarto_id TEXT NOT NULL,
            FOREIGN KEY (tipo_quarto_id) REFERENCES tipo_quarto(id)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela quartos:', err);
        } else {
            console.log('Tabela quartos criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela tipos_quartos
    db.run(`
        CREATE TABLE IF NOT EXISTS tipos_quartos (
            tipo_quarto_id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_quarto TEXT NOT NULL,
            caracteristicas TEXT NOT NULL,
            descricao TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela tipos_quartos:', err);
        } else {
            console.log('Tabela tipos_quartos criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela funcionarios
    db.run(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL,
            cpf TEXT NOT NULL,
            data_nasc DATE NOT NULL,
            endereco TEXT NOT NULL,
            cep TEXT NOT NULL,
            sexo TEXT NOT NULL,
            data_adm DATE NOT NULL,
            setor TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela funcionarios:', err);
        } else {
            console.log('Tabela funcionarios criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela fornecedores
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            cnpj TEXT NOT NULL,
            endereco TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela fornecedores:', err);
        } else {
            console.log('Tabela fornecedores criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela serviços
    db.run(`
        CREATE TABLE IF NOT EXISTS serviços (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quantidade TEXT NOT NULL,
            descricao TEXT NOT NULL,
            tipo_servico TEXT NOT NULL,
            quarto_id TEXT NOT NULL,
            FOREIGN KEY (quarto_id) REFERENCES quartos(numero)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela serviços:', err);
        } else {
            console.log('Tabela serviços criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            nome_produto TEXT NOT NULL,
            fornecedor TEXT NOT NULL,
            unidade_medida TEXT NOT NULL,
            data_entrega DATE NOT NULL,
            preco_compra REAL(10,2) NOT NULL,
            preco_venda REAL(10,2) NOT NULL,
            quantidade TEXT NOT NULL,
            FOREIGN KEY (fornecedor) REFERENCES fornecedores(cnpj)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela produtos:', err);
        } else {
            console.log('Tabela produtos criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela checkins
    db.run(`
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cliente TEXT NOT NULL,
            numero_quarto TEXT NOT NULL,
            data_en TEXT NOT NULL,
            data_sai TEXT NOT NULL,
            status TEXT NOT NULL,        
            FOREIGN KEY (numero_quarto) REFERENCES quartos(numero),
            FOREIGN KEY (id_cliente) REFERENCES clientes(documento)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela checkins:', err);
        } else {
            console.log('Tabela checkins criada com sucesso (ou já existe).');
        }
    });

    // Criar a tabela checkouts
    db.run(`
        CREATE TABLE IF NOT EXISTS checkouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cliente2 TEXT NOT NULL,
            numero_quarto TEXT NOT NULL,
            data_entrada TEXT NOT NULL,
            data_saida TEXT NOT NULL,
            total_pagamento TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (numero_quarto) REFERENCES quartos(numero),
            FOREIGN KEY (id_cliente2) REFERENCES clientes(documento),
            FOREIGN KEY (data_entrada) REFERENCES checkins(data_en)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela checkouts:', err);
        } else {
            console.log('Tabela checkouts criada com sucesso (ou já existe).');
        }
    });
});

// Exemplo de consulta para verificar se as tabelas foram criadas corretamente
db.all("SELECT * FROM produtos", (err, rows) => {
    if (err) {
        console.error('Erro ao consultar produtos:', err);
    } else {
        console.log('Produtos:', rows);
    }
});

// Rota para cadastrar um cliente
app.post('/cadastrar_cl', (req, res) => {
    const { na_cl,
              email_cl,
              phone_cl,
              phoneType_cl,
              address_cl,
              Doc_cl,
              tp_doc_cl,
              pais_cl,
              estado_cl } = req.body;
    db.run(`INSERT INTO clientes (nome, email, telefone, tipo_telefone, endereco, documento, tipo_documento, pais, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [na_cl,
            email_cl,
            phone_cl,
            phoneType_cl,
            address_cl,
            Doc_cl,
            tp_doc_cl,
            pais_cl,
            estado_cl],
        (err) => {
            if (err) {
                console.error('Erro ao cadastrar cliente:', err);
                res.status(500).send('Erro ao cadastrar cliente');
            } else {
                res.send('Cliente cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um quarto
app.post('/cadastrar_quarto', (req, res) => {
    const { num_q, status, tp_quarto  } = req.body;
    db.run(`INSERT INTO quartos (numero, status, tipo_quarto_id) VALUES (?, ?, ?)`, [ num_q, status, tp_quarto ], (err) => {
        if (err) {
            console.error('Erro ao cadastrar quarto:', err);
            res.status(500).send('Erro ao cadastrar quarto');
        } else {
            res.send('Quarto cadastrado com sucesso!');
        }
    });
});

// Rota para cadastrar um tipo de quarto
app.post('/cadastrar_tipo_quarto', (req, res) => {
    const {    tp_qto,
              cara_quarto,
              desc_quarto } = req.body;
    db.run(`INSERT INTO tipos_quartos (tipo_quarto, caracteristicas, descricao) VALUES (?, ?, ?)`,
        [    tp_qto,
            cara_quarto,
            desc_quarto], (err) => {
            if (err) {
                console.error('Erro ao cadastrar tipo de quarto:', err);
                res.status(500).send('Erro ao cadastrar tipo de quarto');
            } else {
                res.send('Tipo de quarto cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um funcionário
app.post('/cadastrar_funcionario', (req, res) => {
    const { func_nm,
              func_tell,
              func_cpf,
              func_nasc,
              func_end,
              func_cep,
              func_sex,
              func_data_ad,
              func_set } = req.body;
    db.run("INSERT INTO funcionarios (nome, telefone, cpf, data_nasc, endereco, cep, sexo, data_adm, setor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [func_nm,
                func_tell,
                func_cpf,
                func_nasc,
                func_end,
                func_cep,
                func_sex,
                func_data_ad,
                func_set],
        function (err) {
            if (err) {
                console.error('Erro ao cadastrar funcionário:', err);
                res.status(500).send('Erro ao cadastrar funcionário');
            } else {
                res.send('Funcionário cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um fornecedor
app.post('/cadastrar_fornecedor', (req, res) => {
    const { nc, cnpj, end } = req.body;
    db.run(`INSERT INTO fornecedores (nome_completo, cnpj, endereco) VALUES (?, ?, ?)`,
        [nc, cnpj, end], (err) => {
            if (err) {
                console.error('Erro ao cadastrar fornecedor:', err);
                res.status(500).send('Erro ao cadastrar fornecedor');
            } else {
                res.send('Fornecedor cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um serviço
app.post('/cadastrar_servico', (req, res) => {
    const {qnt_ser, desc_ser, tp_ser, id_ser } = req.body;
    db.run(`INSERT INTO serviços (quantidade, descricao, tipo_servico, quarto_id) VALUES (?, ?, ?, ?)`,
        [qnt_ser, desc_ser, tp_ser, id_ser], (err) => {
            if (err) {
                console.error('Erro ao cadastrar serviço:', err);
                res.status(500).send('Erro ao cadastrar serviço');
            } else {
                res.send('Serviço cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um produto
app.post('/cadastrar_prod', (req, res) => {
    const {   desc,
              nome,
              forn,
              unid,
              data,
              comp,
              vend,
              qnt_prod } = req.body;
    db.run(`INSERT INTO produtos (descricao, nome_produto, fornecedor, unidade_medida, data_entrega, preco_compra, preco_venda, quantidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [  desc,
            nome,
            forn,
            unid,
            data,
            comp,
            vend,
            qnt_prod], (err) => {
            if (err) {
                console.error('Erro ao cadastrar produto:', err);
                res.status(500).send('Erro ao cadastrar produto');
            } else {
                res.send('Produto cadastrado com sucesso!');
            }
        });
});

// Rota para cadastrar um checkin
app.post('/cadastrar_ci', (req, res) => {
    const {id_cliente, n_quarto, dt_en, dt_sa, status } = req.body;
    db.run(`INSERT INTO checkins (id_cliente, numero_quarto, data_en, data_sai, status) VALUES (?, ?, ?, ?, ?)`,
        [id_cliente, n_quarto, dt_en, dt_sa, status ], (err) => {
            if (err) {
                console.error('Erro ao cadastrar checkin:', err);
                res.status(500).send('Erro ao cadastrar checkin');
            } else {
                res.send('Checkin cadastrado com sucesso!');
            }
        });
});





// Rota para cadastrar um checkout
app.post('/cadastrar_co', (req, res) => {
    const {  id_cliente2,
              n_quarto,
              dt_en,
              dt_sa,
              total,
              status } = req.body;
    db.run(`INSERT INTO checkouts (id_cliente2, numero_quarto, data_entrada, data_saida, total_pagamento, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [  id_cliente2,
            n_quarto,
            dt_en,
            dt_sa,
            total,
            status], (err) => {
            if (err) {
                console.error('Erro ao cadastrar checkout:', err);
                res.status(500).send('Erro ao cadastrar checkout');
            } else {
                res.send('Checkout cadastrado com sucesso!');
            }
        });
});


/////////////////////////////////////////////////
/////////////////               ////////////////
////////////////     APP GET   ////////////////
///////////////               ////////////////
//////////////               ////////////////
////////////////////////////////////////////

// Rota para consultar cliente por documento
app.get('/consultarCliente', (req, res) => {
    const { documento } = req.query;
    db.get('SELECT * FROM clientes WHERE documento = ?', [documento], (err, row) => {
        if (err) {
            console.error('Erro ao consultar cliente:', err);
            res.status(500).json({ error: 'Erro ao consultar cliente' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    });
});

// Rota para consultar quarto por número
app.get('/consulta_quarto', (req, res) => {
    const { numero } = req.query;
    db.get('SELECT * FROM quartos WHERE numero = ?', [numero], (err, row) => {
        if (err) {
            console.error('Erro ao consultar quarto:', err);
            res.status(500).json({ error: 'Erro ao consultar quarto' });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Quarto não encontrado' });
        }
    });
});

// Rota para consultar status dos quartos
app.get('/consulta_status_quarto', (req, res) => {
    const { status } = req.query;
    db.all('SELECT * FROM quartos WHERE status = ?', [status], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar status dos quartos:', err);
            res.status(500).json({ error: 'Erro ao consultar status dos quartos' });
        } else if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'Nenhum quarto encontrado com esse status' });
        }
    });
});

// Rota para consultar check-ins por data de entrada
app.get('/consulta_data_entrada', (req, res) => {
    const { data_entrada } = req.query;
    db.all('SELECT * FROM checkins WHERE data_en = ?', [data_entrada], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar data de entrada:', err);
            res.status(500).json({ error: 'Erro ao consultar data de entrada' });
        } else if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'Nenhuma entrada encontrada para essa data' });
        }
    });
});

// Rota para consultar check-outs por data de saída
app.get('/consulta_data_saida', (req, res) => {
    const { data_saida } = req.query;
    db.all('SELECT * FROM checkouts WHERE data_saida = ?', [data_saida], (err, rows) => {
        if (err) {
            console.error('Erro ao consultar data de saída:', err);
            res.status(500).json({ error: 'Erro ao consultar data de saída' });
        } else if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'Nenhuma saída encontrada para essa data' });
        }
    });
});

app.put('/atualizarCliente', (req, res) => {
    const { documento, nome, email, telefone, endereco, pais, estado } = req.body;

    if (!documento) {
        return res.status(400).json({ error: 'Documento é obrigatório para atualização.' });
    }

    const query = `
        UPDATE clientes
        SET nome = ?, email = ?, telefone = ?, endereco = ?, pais = ?, estado = ?
        WHERE documento = ?
    `;
    const params = [nome, email, telefone, endereco, pais, estado, documento];

    db.run(query, params, function(err) {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        res.json({ success: true });
    });
});



// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


