-- BayLit SQLite Schema

CREATE TABLE IF NOT EXISTS utilizadores (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL CHECK(tipo IN ('consumidor','fornecedor','transportador','admin')),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nif INTEGER,
    telemovel INTEGER,
    estado TEXT NOT NULL DEFAULT 'ativo' CHECK(estado IN ('ativo','inativo','pendente')),
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS consumidores (
    id TEXT PRIMARY KEY,
    utilizador_id TEXT NOT NULL REFERENCES utilizadores(id),
    nome TEXT NOT NULL,
    locais_entrega TEXT NOT NULL DEFAULT '[]',
    carrinho_id TEXT,
    favoritos TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id TEXT PRIMARY KEY,
    utilizador_id TEXT NOT NULL REFERENCES utilizadores(id),
    nome TEXT NOT NULL,
    nif INTEGER,
    morada TEXT,
    armazens TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS transportadores (
    id TEXT PRIMARY KEY,
    utilizador_id TEXT NOT NULL REFERENCES utilizadores(id),
    nome TEXT NOT NULL,
    nif INTEGER,
    morada TEXT,
    portes_encomenda REAL DEFAULT 0,
    meios_transporte TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS administradores (
    id TEXT PRIMARY KEY,
    utilizador_id TEXT NOT NULL REFERENCES utilizadores(id),
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    imagem TEXT,
    subcategorias TEXT NOT NULL DEFAULT '[]',
    atributos TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    fornecedor_id TEXT REFERENCES fornecedores(id),
    categoria_id TEXT REFERENCES categorias(id),
    subcategoria TEXT,
    estado TEXT NOT NULL DEFAULT 'ativo' CHECK(estado IN ('ativo','inativo')),
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS produto_especificos (
    id TEXT PRIMARY KEY,
    produto_id TEXT NOT NULL REFERENCES produtos(id),
    preco REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    atributos TEXT NOT NULL DEFAULT '{}',
    imagens TEXT NOT NULL DEFAULT '[]',
    estado TEXT NOT NULL DEFAULT 'ativo' CHECK(estado IN ('ativo','inativo'))
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    produto_id TEXT NOT NULL REFERENCES produtos(id),
    consumidor_id TEXT NOT NULL REFERENCES consumidores(id),
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comentario TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS carrinhos (
    id TEXT PRIMARY KEY,
    consumidor_id TEXT REFERENCES consumidores(id),
    items TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS encomendas (
    id TEXT PRIMARY KEY,
    consumidor_id TEXT NOT NULL REFERENCES consumidores(id),
    fornecedor_id TEXT REFERENCES fornecedores(id),
    items TEXT NOT NULL DEFAULT '[]',
    local_entrega TEXT NOT NULL DEFAULT '{}',
    estado TEXT NOT NULL DEFAULT 'pendente' CHECK(estado IN ('pendente','confirmado','em_transito','entregue','cancelado')),
    total REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vendas (
    id TEXT PRIMARY KEY,
    encomenda_id TEXT NOT NULL REFERENCES encomendas(id),
    valor REAL NOT NULL,
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id TEXT PRIMARY KEY,
    encomenda_id TEXT NOT NULL REFERENCES encomendas(id),
    valor REAL NOT NULL,
    metodo TEXT NOT NULL DEFAULT 'stripe',
    estado TEXT NOT NULL DEFAULT 'pendente' CHECK(estado IN ('pendente','pago','falhado','reembolsado')),
    stripe_payment_intent TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS descontos (
    id TEXT PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    percentagem REAL NOT NULL CHECK(percentagem > 0 AND percentagem <= 100),
    data_fim DATETIME,
    ativo INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS armazens (
    id TEXT PRIMARY KEY,
    fornecedor_id TEXT NOT NULL REFERENCES fornecedores(id),
    nome TEXT NOT NULL,
    local TEXT NOT NULL DEFAULT '{}',
    capacidade INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS armazenamentos (
    id TEXT PRIMARY KEY,
    produto_especifico_id TEXT NOT NULL REFERENCES produto_especificos(id),
    armazem_id TEXT NOT NULL REFERENCES armazens(id),
    quantidade INTEGER NOT NULL DEFAULT 0,
    data_entrada DATETIME DEFAULT (datetime('now')),
    data_saida DATETIME
);

CREATE TABLE IF NOT EXISTS producoes (
    id TEXT PRIMARY KEY,
    produto_id TEXT NOT NULL REFERENCES produtos(id),
    local TEXT NOT NULL DEFAULT '{}',
    recursos TEXT NOT NULL DEFAULT '[]',
    poluicao TEXT NOT NULL DEFAULT '{}',
    data_inicio DATETIME,
    data_fim DATETIME
);

CREATE TABLE IF NOT EXISTS meios_transporte (
    id TEXT PRIMARY KEY,
    transportador_id TEXT NOT NULL REFERENCES transportadores(id),
    tipo TEXT NOT NULL,
    capacidade REAL NOT NULL DEFAULT 0,
    emissao_base REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS condutores (
    id TEXT PRIMARY KEY,
    transportador_id TEXT NOT NULL REFERENCES transportadores(id),
    nome TEXT NOT NULL,
    licenca TEXT
);

CREATE TABLE IF NOT EXISTS transportes (
    id TEXT PRIMARY KEY,
    produto_id TEXT REFERENCES produtos(id),
    meio_transporte_id TEXT REFERENCES meios_transporte(id),
    condutor_id TEXT REFERENCES condutores(id),
    origem TEXT NOT NULL DEFAULT '{}',
    destino TEXT NOT NULL DEFAULT '{}',
    etapas TEXT NOT NULL DEFAULT '[]',
    emissoes_co2 REAL NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'pendente' CHECK(estado IN ('pendente','em_transito','concluido'))
);

CREATE TABLE IF NOT EXISTS locais (
    id TEXT PRIMARY KEY,
    morada TEXT NOT NULL,
    cp TEXT,
    cidade TEXT,
    pais TEXT DEFAULT 'Portugal',
    lat REAL,
    lng REAL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor ON produtos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_produto_especificos_produto ON produto_especificos(produto_id);
CREATE INDEX IF NOT EXISTS idx_encomendas_consumidor ON encomendas(consumidor_id);
CREATE INDEX IF NOT EXISTS idx_encomendas_fornecedor ON encomendas(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_transportes_produto ON transportes(produto_id);
CREATE INDEX IF NOT EXISTS idx_producoes_produto ON producoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_armazenamentos_armazem ON armazenamentos(armazem_id);
CREATE INDEX IF NOT EXISTS idx_reviews_produto ON reviews(produto_id);
