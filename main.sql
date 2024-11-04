create table if not EXISTS cliente(
  id integer primary key AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  tipo_telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  documento TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  codigo_cliente TEXT NOT NULL,
  estado TEXT,
  cidade TEXT
);

create table if not EXISTS quarto(
  numero integer primary key,
  tipo_quarto_id int NOT NULL,
  foreign key(tipo_quarto_id) references tipo_quarto(id)
);

create table if not EXISTS tipo_quarto(
  tipo_quarto_id integer primary key autoincrement,
  tipo_quarto TEXT NOT NULL,
  caracteristicas TEXT NOT NULL,
  equipamentos TEXT NOT NULL,
  quant_itens INT NOT NULL,
  descrição TEXT NOT NULL
);

create table if not EXISTS funcionarios(
  id INTEGER primary key autoincrement,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nasc DATE NOT NULL,
  municipio TEXT NOT NULL,
  uf TEXT NOT NULL,
  endereço TEXT NOT NULL,
  cep TEXT NOT NULL,
  sexo TEXT NOT NULL,
  grau_instrução TEXT NOT NULL,
  pis_pasep TEXT NOT NULL,
  data_adm date NOT NULL,
  Cart_trabalho TEXT NOT NULL,
  serie TEXT NOT NULL,
  setor TEXT NOT NULL
);

create table IF NOT EXISTS fornecedor(
  id integer primary key autoincrement,
  nome_completo TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  fabricante TEXT NOT NULL,
  endereço TEXT NOT NULL
);

create table IF NOT EXISTS servico(
  id INTEGER primary key autoincrement,
  nome_servico TEXT NOT NULL,
  quantidade INT NOT NULL,
  tipo_servico TEXT NOT NULL,
  quarto_id INT NOT NULL,
  FOREIGN KEY (quarto_id) REFERENCES quarto(numero)
);

create table IF NOT EXISTS produto(
  id INTEGER primary key autoincrement,
  descricao TEXT NOT NULL,
  nome_produto TEXT NOT NULL,
  fornecedor INT NOT NULL,
  codigo_produto TEXT NOT NULL,
  unidade_medida TEXT NOT NULL,
  data_entrega DATE NOT NULL,
  preco_compra REAL(10,2) NOT NULL,
  preco_venda REAL(10,2) NOT NULL,
  quantidade INT NOT NULL,
  codigo_fabricante TEXT NOT NULL,
  FOREIGN KEY (fornecedor) REFERENCES fornecedor(id)
);

create table if not EXISTS checkin(
  id integer primary key AUTOINCREMENT,
  numero_quarto TEXT NOT NULL,
  data_en TEXT NOT NULL,
  data_sai TEXT NOT NULL,
  statu TEXT NOT NULL,
  FOREIGN KEY (numero_quarto) REFERENCES quarto(numero)
);

create table if not EXISTS checkout(
  id integer primary key AUTOINCREMENT,
  numero_quarto TEXT NOT NULL,
  data_en TEXT NOT NULL,
  data_sai TEXT NOT NULL,
  total_pagamento TEXT NOT NULL,
  statu TEXT NOT NULL,
  FOREIGN KEY (numero_quarto) REFERENCES quarto(numero)
);
--INSERT into produto(descricao, nome_produto, fornecedor, codigo_produto, unidade_medida, data_entrega, preco_compra, preco_venda, quantidade, codigo_fabricante)
--VALUES('refrigerante de fanta','fanta lata','fanta brasil','55','ml','12/12/24','2,0','5,0','25','112423')
SELECT * FROM produto
