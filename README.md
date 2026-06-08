# ❤️ Sistema de Acompanhamento de Saúde Cardíaca - Backend

API RESTful desenvolvida para o gerenciamento e monitoramento de dados de saúde cardíaca de pacientes. Este projeto foi construído utilizando **Python** e o framework **FastAPI**, garantindo alta performance, segurança e documentação automática baseada na especificação **OpenAPI 3.0.3**.

> Projeto acadêmico desenvolvido na Universidade Federal do Estado do Rio de Janeiro (UNIRIO).

---

# 🏛️ Arquitetura do Sistema

O sistema segue uma arquitetura **Cliente-Servidor** baseada em princípios RESTful, focada em escalabilidade e separação clara de responsabilidades.

## Backend (API)

Desenvolvido em **FastAPI**, atua como o motor central da aplicação, processando as requisições HTTP, executando as regras de negócio e retornando respostas estruturadas em formato JSON.

## Banco de Dados

Utiliza **SQLite** para armazenamento relacional leve e local. A comunicação entre o código Python e o banco é realizada através do ORM (**Object-Relational Mapping**) **SQLAlchemy**, eliminando a necessidade de consultas SQL manuais no código-fonte.

## Controle de Versão do Banco de Dados

O **Alembic** é utilizado para gerenciar as migrações (*migrations*) estruturais do banco de dados, permitindo rastreabilidade e evolução segura das tabelas.

## Segurança e Autenticação

A proteção das rotas privadas é realizada através de **JWT (JSON Web Tokens)** gerados com a biblioteca **python-jose**, garantindo que apenas usuários autenticados possam acessar recursos protegidos da aplicação.

---

# 🧩 Descrição da Modularização

O código-fonte foi modularizado para separar responsabilidades, facilitar a manutenção, evitar redundâncias e permitir o desenvolvimento simultâneo pelos membros da equipe.

## Estrutura do Projeto

```text
backend-ssc/
│
├── alembic/
├── routers/
│   ├── auth.py
│   └── acompanhamento.py
    └── relatorios.py
│
├── dependencies.py
├── main.py
├── models.py
├── schemas.py
├── alembic.ini
├── requirements.txt
└── ssc.db
```

### 📄 main.py

O "coração" da aplicação. É o ponto de entrada responsável por:

* Inicializar o servidor FastAPI;
* Configurar permissões de acesso;
* Registrar e anexar os routers ao aplicativo principal.

### 🗄️ models.py (Camada de Banco de Dados)

Contém a representação das tabelas do banco de dados.

Exemplos:

* `User`
* `RegistroSaude`

As classes Python são mapeadas diretamente para o SQLite através do SQLAlchemy.

### ✅ schemas.py (Camada de Validação)

Utiliza a biblioteca **Pydantic** para definir os contratos de dados da API.

Responsável por:

* Validar tipos de dados;
* Validar formatos de entrada;
* Estruturar respostas da API.

### 🌐 routers/ (Camada de Controladores)

Agrupa os endpoints da API por contexto de negócio.

#### auth.py

Responsável por:

* Cadastro de usuários;
* Login;
* Emissão de tokens JWT;
* Renovação de autenticação.

#### acompanhamento.py

Responsável por:

* Cadastro de informações de saúde cardíaca;
* Consulta de histórico do paciente;
* Gerenciamento dos registros diários.

#### relatorios.py

Responsável por exibir :

* Quantidade total de registros cadastrados;
* Média da frequência cardíaca;
* Média do nível de oxigenação sanguínea;
* Média do peso corporal.


### 🔗 dependencies.py

Agrupa funções reutilizáveis necessárias para as rotas.

Exemplos:

* `pegar_sessao()`
* `verificar_token()`

Responsável pelo gerenciamento de sessão e autenticação.


### Endpoint /relatorios/ultimo

Retorna o registro de saúde mais recente do usuário autenticado, incluindo:

* Pressão arterial;
* Frequência cardíaca;
* Nível de oxigenação;
* Peso corporal;
* Sintomas informados;
* Data do registro.

Esse endpoint é utilizado para exibir rapidamente o estado mais recente do paciente sem a necessidade de consultar todo o histórico de registros.

### 🔄 alembic/ e alembic.ini

Responsáveis pelo gerenciamento de migrações do banco de dados.

Garantem que a estrutura física do banco permaneça sincronizada com as definições presentes em `models.py`.

---

# ⚙️ Como Executar o Projeto Localmente

## 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/thauanhub/Sistema-de-Acompanhamento-de-Saude-Cardiaca
cd Sistema-de-Acompanhamento-de-Saude-Cardiaca/ssc/backend-ssc
```

---

## 2️⃣ Criar e Ativar o Ambiente Virtual

### Criar ambiente virtual

```bash
python -m venv venv
```

### Ativar no Windows (PowerShell ou Git Bash)

```bash
.\venv\Scripts\activate
```

### Caso ocorra erro de permissão no PowerShell

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

---

## 3️⃣ Instalar as Dependências

```bash
pip install -r requirements.txt
pip install alembic sqlalchemy-utils
```

---

## 4️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `backend-ssc`:

```env
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 5️⃣ Criar o Banco de Dados

Execute as migrações:

```bash
alembic upgrade head
```

---

## 6️⃣ Iniciar o Servidor

```bash
uvicorn main:app --reload
```

---

# 📚 Documentação da API

Após iniciar o servidor, a documentação interativa estará disponível em:

```text
http://127.0.0.1:8000/docs
```

A documentação é gerada automaticamente pelo Swagger UI através do OpenAPI.

---

# 🚀 Tecnologias Utilizadas

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Alembic
* JWT (python-jose)
* Pydantic
* Uvicorn

---

# 👥 Equipe

* Bruno Aichinger
* Cecília Lima Machado
* Thauan Fabricio
* Gabriel de Oliveira

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Engenharia de Software II da UNIRIO.
