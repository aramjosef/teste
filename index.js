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

// Rota para consultar checkin
app.get('/consultar-checkin', (req, res) => {
    const { id, numero_quarto, data_en, data_sai, status } = req.query;

    let sql = `
        SELECT 
            checkins.id,
            checkins.numero_quarto, 
            checkins.data_en, 
            checkins.data_sai, 
            clientes.nome AS nome_cliente, 
        FROM 
            checkins
        JOIN 
            clientes ON checkins.idCliente = clientes.id
        WHERE 1=1
    `;
    const params = [];

    if (id) {
        sql += " AND checkins.id = ?";
        params.push(id);
    }
    if (numero_quarto) {
        sql += " AND checkins.numero_quarto = ?";
        params.push(numero_quarto);
    }
    if (data_en) {
        sql += " AND checkins.data_en = ?";
        params.push(data_en);
    }
    if (data_sai) {
        sql += " AND checkins.data_sai = ?";
        params.push(data_sai);
    }
    if (status) {
        sql += " AND checkins.status = ?";
        params.push(status);
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar check-in:', err);
            return res.status(500).send('Erro ao consultar check-in.');
        }
        res.json(rows);
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
    db.run(`INSERT INTO checkouts (id_cliente2,numero_quarto, data_entrada, data_saida, status) VALUES (?, ?, ?, ?, ?)`,
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

// Rota para cadastrar uma reserva
app.post('/cadastrar-reserva', (req, res) => {
    const { data_reserva, data_checkin, data_checkout, numero_quarto, cliente_id } = req.body;
    db.run(`INSERT INTO reservas (data_reserva, data_checkin, data_checkout, numero_quarto, cliente_id) VALUES (?, ?, ?, ?, ?)`,
        [data_reserva, data_checkin, data_checkout, numero_quarto, cliente_id], (err) => {
            if (err) {
                console.error('Erro ao cadastrar reserva:', err);
                res.status(500).send('Erro ao cadastrar reserva');
            } else {
                res.send('Reserva cadastrada com sucesso!');
            }
        });
});

// Rota para buscar clientes
app.get('/buscar-cliente', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no nome, email ou código do cliente
    db.all(`SELECT id, nome, email, codigo_cliente FROM clientes WHERE nome LIKE ? OR email LIKE ? OR codigo_cliente LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar clientes:', err);
                res.status(500).send('Erro ao buscar clientes');
            } else {
                res.json(rows);  // Retorna os clientes encontrados
            }
        });
});

// Rota para buscar quartos
app.get('/buscar-quarto', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no número do quarto ou tipo de quarto
    db.all(`SELECT numero, tipo_quarto_id FROM quartos WHERE numero LIKE ? OR tipo_quarto_id LIKE ?`,
        [`%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar quartos:', err);
                res.status(500).send('Erro ao buscar quartos');
            } else {
                res.json(rows);  // Retorna os quartos encontrados
            }
        });
});

// Rota para buscar tipos de quarto
app.get('/buscar-tipo-quarto', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no tipo de quarto
    db.all(`SELECT tipo_quarto_id, tipo_quarto FROM tipos_quartos WHERE tipo_quarto LIKE ?`,
        [`%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar tipos de quarto:', err);
                res.status(500).send('Erro ao buscar tipos de quarto');
            } else {
                res.json(rows);  // Retorna os tipos de quarto encontrados
            }
        });
});

// Rota para buscar funcionários
app.get('/buscar-funcionario', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no nome ou CPF do funcionário
    db.all(`SELECT id, nome, cpf FROM funcionarios WHERE nome LIKE ? OR cpf LIKE ?`,
        [`%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar funcionários:', err);
                res.status(500).send('Erro ao buscar funcionários');
            } else {
                res.json(rows);  // Retorna os funcionários encontrados
            }
        });
});

// Rota para buscar fornecedores
app.get('/buscar-fornecedor', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no nome ou CNPJ do fornecedor
    db.all(`SELECT id, nome_completo, cnpj FROM fornecedores WHERE nome_completo LIKE ? OR cnpj LIKE ?`,
        [`%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar fornecedores:', err);
                res.status(500).send('Erro ao buscar fornecedores');
            } else {
                res.json(rows);  // Retorna os fornecedores encontrados
            }
        });
});

// Rota para buscar produtos
app.get('/buscar-produto', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no nome, descrição ou código do produto
    db.all(`SELECT id, nome_produto, descricao, codigo_produto FROM produtos WHERE nome_produto LIKE ? OR descricao LIKE ? OR codigo_produto LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar produtos:', err);
                res.status(500).send('Erro ao buscar produtos');
            } else {
                res.json(rows);  // Retorna os produtos encontrados
            }
        });
});

// Rota para buscar checkins
app.get('/buscar-checkin', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no número do quarto ou data de entrada
    db.all(`SELECT id, numero_quarto, data_en, data_sai FROM checkins WHERE numero_quarto LIKE ? OR data_en LIKE ? OR data_sai LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar checkins:', err);
                res.status(500).send('Erro ao buscar checkins');
            } else {
                res.json(rows);  // Retorna os checkins encontrados
            }
        });
});

// Rota para buscar checkouts
app.get('/buscar-checkout', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no número do quarto ou data de saída
    db.all(`SELECT id, numero_quarto, data_en, data_sai FROM checkouts WHERE numero_quarto LIKE ? OR data_en LIKE ? OR data_sai LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar checkouts:', err);
                res.status(500).send('Erro ao buscar checkouts');
            } else {
                res.json(rows);  // Retorna os checkouts encontrados
            }
        });
});

// Rota para buscar reservas
app.get('/buscar-reserva', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no número do quarto, data de reserva, data de checkin ou data de checkout
    db.all(`SELECT id, data_reserva, data_checkin, data_checkout, numero_quarto, cliente_id FROM reservas WHERE numero_quarto LIKE ? OR data_reserva LIKE ? OR data_checkin LIKE ? OR data_checkout LIKE ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar reservas:', err);
                res.status(500).send('Erro ao buscar reservas');
            } else {
                res.json(rows);  // Retorna as reservas encontradas
            }
        });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

