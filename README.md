# 🍜 Sistema de Gestão de Marmitas (Vercel Serverless Edition)

> **Status do Projeto**: ✅ Backend & Frontend **Totalmente Integrados e Otimizados para Vercel** 🚀

## 📋 Índice
- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Quick Start (Desenvolvimento Local)](#-quick-start-desenvolvimento-local)
- [Como Funciona na Vercel (Arquitetura)](#-como-funciona-na-vercel-arquitetura)
- [Endpoints da API](#-endpoints-da-api)
- [Como Usar e Testar](#-como-usar-e-testar)
- [Troubleshooting (Resolução de Problemas)](#-troubleshooting-resolução-de-problemas)

---

## 🎯 Visão Geral

Este é um sistema web completo desenvolvido como trabalho acadêmico para gerenciar de forma simplificada o cadastro de **clientes, produtos (marmitas) e pedidos**. 

O grande diferencial desta versão é a sua arquitetura unificada (**Monorepo**): o frontend em React e o backend em Flask (Python) moram no mesmo repositório e rodam de forma nativa na nuvem da **Vercel** através de *Serverless Functions*, dispensando a necessidade de gerenciar servidores tradicionais ligados 24/7.

---

## 🛠️ Stack Tecnológica

* **Frontend:** React 19+, Vite (Build Tool), CSS Modules (Estilização), Fetch API.
* **Backend:** Python 3.x, Flask (Rotas e API), Werkzeug (Segurança e Hashing de Senhas).
* **Banco de Dados:** SQLite (Armazenamento em arquivo leve).
* **Deploy & Hospedagem:** Vercel (Hospedagem estática do Front + Serverless Functions para o Back).

---

## 📁 Estrutura do Projeto

Conforme configurado para o ambiente de microsserviços da Vercel, o repositório segue a seguinte árvore de diretórios:

```text
AtvMetodosAPI/                  # Raiz do projeto
│
├── api/                        # 🐍 Pasta do Backend (Reconhecida pela Vercel)
│   └── index.py                # Ponto de entrada do Flask (antigo main.py)
│
├── src/                        # ⚛️ Pasta do Frontend (React)
│   ├── main.jsx                # Inicialização do React
│   ├── App.jsx                 # Componente Raiz
│   └── Pages/
│       └── PainelAdm/
│           └── AdmComponents/
│               ├── FormCliente.jsx   # Formulário de Clientes (Fetches relativos)
│               ├── FormPedido.jsx    # Formulário de Pedidos (Campos corrigidos)
│               └── FormProduto.jsx   # Formulário de Produtos
│
├── package.json                # Dependências e scripts do Node.js/Vite
├── requirements.txt            # Dependências do Python (Flask, Flask-CORS, etc.)
├── vercel.json                 # ⚙️ Arquivo de Configuração de Builds da Vercel
├── .gitignore                  # Proteção para não subir o node_modules
└── README.md                   # Documentação do projeto
```

---

## ⚡ Quick Start (Desenvolvimento Local)

Para rodar e testar os dois ambientes juntos no seu computador simulando exatamente o comportamento da Vercel, utilize a **Vercel CLI**.

### Pré-requisitos
1. Ter o **Python 3.x** e o **Node.js** instalados na máquina.
2. Instalar a ferramenta de linha de comando da Vercel globalmente:
   ```bash
   npm install -g vercel
   ```

### Executando o Projeto:
1. Abra o terminal na raiz do projeto (`AtvMetodosAPI/`).
2. Instale as dependências do frontend:
   ```bash
   npm install
   ```
3. Execute o comando mágico que levanta o Front e o Back juntos na mesma porta:
   ```bash
   vercel dev
   ```
4. O terminal irá baixar as dependências do Python contidas no `requirements.txt` automaticamente e disponibilizará o projeto em: **`http://localhost:3000`** ✅

---

## 🏗️ Como Funciona na Vercel (Arquitetura)

### O Fluxo Serverless
Diferente de uma hospedagem comum, a Vercel não mantém o Python rodando o tempo todo. 
1. O arquivo `vercel.json` intercepta qualquer requisição feita para `/api/*`.
2. A Vercel "acorda" a função contida em `api/index.py`.
3. O Flask processa a rota (ex: `/api/clientes`), interage com o banco e devolve o JSON.
4. A função "dorme" novamente.

```text
┌──────────────────────────┐          ┌────────────────────────────┐
│   Frontend (React/Vite)  │ ───► ─── │     Roteador Vercel        │
│   Rodando no Navegador   │ ◄─── ◄── │    (Urls Relativas /api)   │
└──────────────────────────┘          └──────────────┬─────────────┘
                                                     │
                                                     ▼ (Direciona para Serverless)
                                      ┌────────────────────────────┐
                                      │       api/index.py         │
                                      │     Backend em Flask       │
                                      └──────────────┬─────────────┘
                                                     │
                                                     ▼ (Persistência Temporária)
                                      ┌────────────────────────────┐
                                      │ /tmp/sistema_extensao.db   │
                                      │    Banco de Dados SQLite   │
                                      └────────────────────────────┘
```

### O Banco de Dados na Nuvem (`/tmp/`)
Como o ambiente Serverless é de leitura escrita bloqueada na raiz, o SQLite foi configurado para salvar o arquivo de banco de dados na pasta temporária do sistema local: `DATABASE = '/tmp/sistema_extensao.db'`. 
* *Nota acadêmica:* Por ser um ambiente efêmero, os dados inseridos persistem enquanto a aplicação estiver recebendo requisições ativas (perfeito para rodar liso durante a apresentação dos professores).

---

## 📡 Endpoints da API

Todas as rotas do backend Flask foram unificadas utilizando o prefixo `/api` para casar perfeitamente com o roteamento dinâmico.

### 👥 Clientes
* **Cadastrar Cliente:** `POST /api/clientes`
  ```json
  {
    "nome": "Jônatas",
    "email": "jonatas@email.com",
    "telefone": "11999999999",
    "endereco": "Bragança Paulista - SP",
    "senha": "senhaSegura123"
  }
  ```
  *(A senha é criptografada em uma hash segura antes de ir para o banco)*

### 🍱 Produtos (Marmitas)
* **Cadastrar Produto:** `POST /api/produtos`
  ```json
  {
    "nome": "Marmita Fit de Frango",
    "tipo": "Fit",
    "descricao": "Arroz integral, purê de batata doce e frango grelhado"
  }
  ```

### 📝 Pedidos & Itens
* **Criar Pedido:** `POST /api/pedidos`
  ```json
  {
    "id_cliente": 1,
    "data": "2026-06-19",
    "status": "pendente",
    "total": 25.50
  }
  ```
* **Adicionar Item ao Pedido:** `POST /api/itens-pedido`
* **Consultar Pedidos Completos (Dashboard com JOIN):** `GET /api/pedidos/completos`

---

## 📖 Como Usar e Testar

### Testando a Integração Local
1. Com o `vercel dev` rodando, acesse a interface.
2. Abra o formulário de **Cadastro de Cliente**, preencha os dados e clique em salvar. O feedback visual de sucesso deve aparecer na tela.
3. Abra as ferramentas do desenvolvedor no navegador (Aperte **F12**), vá na aba **Network (Rede)** e veja a requisição disparando de forma limpa para `/api/clientes` sem erros de CORS ou endereço.

### Fazendo o Deploy Oficial
Toda vez que você atualizar o código, basta usar os comandos padrão do Git:
```bash
git add .
git commit -m "feat: atualizando integracao do sistema"
git push
```
A Vercel vai ler as alterações do GitHub, identificar o arquivo `vercel.json` e atualizar o site em produção de forma 100% automática em menos de um minuto.

---

## 🐛 Troubleshooting (Resolução de Problemas)

### ❌ Erro: `Failed to load resource: status 404` para as rotas `/api/...`
* **Causa:** O Flask antigo rodava apenas em `/clientes`, mas o Front pede `/api/clientes`.
* **Solução:** Certifique-se de que no arquivo `api/index.py` todas as rotas comecem estritamente com o prefixo `/api` (Ex: `@app.route('/api/clientes', methods=['POST'])`).

### ❌ Erro: O Banco de dados não cria as tabelas na Vercel
* **Causa:** A função `inicializar_banco()` estava escondida dentro do bloco `if __name__ == '__main__':`, que é ignorado pela Vercel.
* **Solução:** O arquivo `api/index.py` deve invocar a função `inicializar_banco()` solta no escopo global do código, logo antes do bloco `if` final.

### ❌ Erro: `OperationalError: attempt to write a readonly database`
* **Causa:** O SQLite tentou criar o arquivo `.db` na raiz do projeto dentro da Vercel, que proíbe escrita.
* **Solução:** Garanta que a variável `DATABASE` no Python esteja apontando para a pasta temporária `/tmp/sistema_extensao.db`.

---
*Projeto desenvolvido para fins educacionais - Tecnologia de Análise e Desenvolvimento de Sistemas (ADS).*
