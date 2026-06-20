import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)  # Permite que o frontend em React acesse a API

DATABASE = 'sistema_extensao.db'

def conectar_banco():
    """Conecta ao SQLite e garante que o suporte a chaves estrangeiras esteja ativo."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Permite acessar colunas pelo nome
    conn.execute("PRAGMA foreign_keys = ON;")  # Ativa chaves estrangeiras no SQLite
    return conn

def validar_json(dados, campos_obrigatorios):
    if not isinstance(dados, dict):
        resposta = jsonify({"erro": "Requisição JSON inválida."})
        resposta.status_code = 400
        return resposta

    campos_ausentes = [campo for campo in campos_obrigatorios if dados.get(campo) is None]
    if campos_ausentes:
        resposta = jsonify({"erro": f"Campos obrigatórios ausentes: {', '.join(campos_ausentes)}."})
        resposta.status_code = 400
        return resposta

    return None

def inicializar_banco():
    """Cria as tabelas aplicando os ajustes do modelo lógico."""
    conn = conectar_banco()
    cursor = conn.cursor()
    
    # 1. Tabela Cliente (com hash de senha)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Cliente (
            id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            endereco TEXT,
            telefone TEXT,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    ''')
    
    # 2. Tabela Produto
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Produto (
            id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            descricao TEXT,
            nome TEXT NOT NULL
        )
    ''')
    
    # 3. Tabela Pedido
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Pedido (
            id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cliente INTEGER NOT NULL,
            data TEXT NOT NULL,
            status TEXT NOT NULL,
            total REAL DEFAULT 0.0,
            FOREIGN KEY (id_cliente) REFERENCES Cliente (id_cliente)
        )
    ''')
    
    # 4. Tabela Item_Pedido 
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Item_Pedido (
            id_pedido INTEGER NOT NULL,
            id_produto INTEGER NOT NULL,
            qtd_pedido INTEGER NOT NULL,
            valor_unitario REAL NOT NULL,
            PRIMARY KEY (id_pedido, id_produto),
            FOREIGN KEY (id_pedido) REFERENCES Pedido (id_pedido) ON DELETE CASCADE,
            FOREIGN KEY (id_produto) REFERENCES Produto (id_produto)
        )
    ''')
    
    conn.commit()
    conn.close()

# ROTAS DA API

# CADASTRAR CLIENTE
@app.route('/clientes', methods=['POST'])
def cadastrar_cliente():
    dados = request.get_json(silent=True) or {}
    resposta = validar_json(dados, ['nome', 'email', 'senha'])
    if resposta is not None:
        return resposta

    # Criptografia da senha usando hash seguro
    senha_criptografada = generate_password_hash(dados['senha'])
    conn = None
    
    try:
        conn = conectar_banco()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Cliente (nome, endereco, telefone, email, senha)
            VALUES (?, ?, ?, ?, ?)
        ''', (dados['nome'], dados.get('endereco'), dados.get('telefone'), dados['email'], senha_criptografada))
        conn.commit()
        id_gerado = cursor.lastrowid
        return jsonify({"mensagem": "Cliente cadastrado com sucesso!", "id_cliente": id_gerado}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Este e-mail já está cadastrado."}), 400
    finally:
        if conn is not None:
            conn.close()

# CADASTRAR PRODUTO
@app.route('/produtos', methods=['POST'])
def cadastrar_produto():
    dados = request.get_json(silent=True) or {}
    resposta = validar_json(dados, ['tipo', 'nome'])
    if resposta is not None:
        return resposta

    conn = conectar_banco()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Produto (tipo, descricao, nome)
            VALUES (?, ?, ?)
        ''', (dados['tipo'], dados.get('descricao'), dados['nome']))
        conn.commit()
        id_gerado = cursor.lastrowid
        return jsonify({"mensagem": "Produto cadastrado com sucesso!", "id_produto": id_gerado}), 201
    finally:
        conn.close()

# CADASTRAR PEDIDO
@app.route('/pedidos', methods=['POST'])
def cadastrar_pedido():
    dados = request.get_json(silent=True) or {}
    resposta = validar_json(dados, ['id_cliente', 'data', 'status'])
    if resposta is not None:
        return resposta

    conn = conectar_banco()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO Pedido (id_cliente, data, status, total)
            VALUES (?, ?, ?, ?)
        ''', (dados['id_cliente'], dados['data'], dados['status'], dados.get('total', 0.0)))
        conn.commit()
        id_gerado = cursor.lastrowid
        return jsonify({"mensagem": "Pedido iniciado com sucesso!", "id_pedido": id_gerado}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Cliente informado não existe."}), 400
    finally:
        conn.close()

# ADICIONAR ITENS AO PEDIDO
@app.route('/itens-pedido', methods=['POST'])
def adicionar_item_pedido():
    dados = request.get_json(silent=True) or {}
    resposta = validar_json(dados, ['id_pedido', 'id_produto', 'qtd_pedido', 'valor_unitario'])
    if resposta is not None:
        return resposta

    conn = conectar_banco()
    cursor = conn.cursor()
    try:
        # Insere o item
        cursor.execute('''
            INSERT INTO Item_Pedido (id_pedido, id_produto, qtd_pedido, valor_unitario)
            VALUES (?, ?, ?, ?)
        ''', (dados['id_pedido'], dados['id_produto'], dados['qtd_pedido'], dados['valor_unitario']))
        
        # Atualiza automaticamente o valor total do Pedido somando o novo item
        cursor.execute('''
            UPDATE Pedido 
            SET total = total + (? * ?) 
            WHERE id_pedido = ?
        ''', (dados['qtd_pedido'], dados['valor_unitario'], dados['id_pedido']))
        
        conn.commit()
        return jsonify({"mensagem": "Item adicionado ao pedido com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Erro de integridade. Verifique se o Pedido e o Produto existem, ou se o item já foi adicionado."}), 400
    finally:
        conn.close()

# ROTA AUXILIAR PARA CONSULTAR DADOS (Útil para o TanStack Query testar os GETs)
@app.route('/pedidos/completos', methods=['GET'])
def listar_pedidos_completos():
    conn = conectar_banco()
    cursor = conn.cursor()
    
    # Busca os pedidos trazendo junto o nome do cliente associado (JOIN)
    pedidos = cursor.execute('''
        SELECT p.id_pedido, p.data, p.status, p.total, c.nome as nome_cliente 
        FROM Pedido p
        JOIN Cliente c ON p.id_cliente = c.id_cliente
    ''').fetchall()
    
    resultado = []
    for p in pedidos:
        dict_pedido = dict(p)
        # Para cada pedido, busca seus respectivos itens e detalhes do produto
        itens = cursor.execute('''
            SELECT ip.qtd_pedido, ip.valor_unitario, pr.nome as nome_produto
            FROM Item_Pedido ip
            JOIN Produto pr ON ip.id_produto = pr.id_produto
            WHERE ip.id_pedido = ?
        ''', (dict_pedido['id_pedido'],)).fetchall()
        
        dict_pedido['itens'] = [dict(i) for i in itens]
        resultado.append(dict_pedido)
        
    conn.close()
    return jsonify(resultado), 200

if __name__ == '__main__':
    inicializar_banco()  # Garante a criação do banco e das tabelas ao iniciar
    app.run(debug=True)