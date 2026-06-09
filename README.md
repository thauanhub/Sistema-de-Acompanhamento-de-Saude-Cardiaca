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

# 🧪 Testes Automatizados

O sistema conta com uma suíte de testes robusta utilizando o framework **Pytest** e a biblioteca **HTTPX**. Os testes foram rigorosamente segregados entre **Unitários** (validação de dados isolados) e **Integração** (testes de endpoints e fluxos completos de negócio), garantindo a confiabilidade e a segurança da API.

#### Estrutura do Diretório de Testes
```text
tests/
│
├── integration/
│   ├── test_autenticacao.py       # Registro, login e validações HTTP da camada Auth
│   ├── test_fluxo_completo.py     # Fluxo ponta a ponta (E2E): cadastro -> login -> consumo de rota privada
│   └── test_seguranca_rotas.py    # Validação de barreiras de proteção de endpoints privados
│
├── unit/
│   └── test_validacao.py          # Testes isolados dos esquemas do Pydantic (User e Registro)
│
└── conftest.py                    # Configuração centralizada do TestClient do FastAPI
```

## 🛠️ Como Executar a Suíte de Testes
Com o ambiente virtual (venv) ativado e no diretório raiz do backend (backend-ssc), execute o comando abaixo para rodar todos os testes em modo detalhado (verbose):

```bash
python -m pytest -v
```

## 📊 Evidência de Sucesso da Execução
Todas as regras de validação, fluxos end-to-end e proteções contra acessos não autorizados passaram com sucesso em menos de um segundo:

```text
(venv) PS C:\Users\gsouz\ArquivosVSCode\Sistema Saúde Cardiaca\Sistema-de-Acompanhamento-de-Saude-Cardiaca\ssc\backend-ssc> python -m pytest -v
=================================================== test session starts ====================================================
platform win32 -- Python 3.13.13, pytest-9.0.3, pluggy-1.6.0 -- C:\Users\gsouz\ArquivosVSCode\Sistema Saúde Cardiaca\Sistema-de-Acompanhamento-de-Saude-Cardiaca\ssc\backend-ssc\venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\gsouz\ArquivosVSCode\Sistema Saúde Cardiaca\Sistema-de-Acompanhamento-de-Saude-Cardiaca\ssc\backend-ssc    
plugins: anyio-4.9.0
collected 13 items                                                                                                           

tests/integration/test_autenticacao.py::test_rota_auth_home PASSED                                                    [  7%] 
tests/integration/test_autenticacao.py::test_registro_usuario_novo PASSED                                             [ 15%]
tests/integration/test_autenticacao.py::test_login_usuario_inexistente PASSED                                         [ 23%] 
tests/integration/test_fluxo_completo.py::test_fluxo_completo_usuario PASSED                                          [ 30%]
tests/integration/test_seguranca_rotas.py::test_acesso_negado_sem_token_acompanhamento PASSED                         [ 38%] 
tests/integration/test_seguranca_rotas.py::test_acesso_negado_sem_token_relatorios PASSED                             [ 46%]
tests/integration/test_seguranca_rotas.py::test_post_acompanhamento_sem_token PASSED                                  [ 53%] 
tests/unit/test_validacao.py::test_criar_usuario_valido PASSED                                                        [ 61%] 
tests/unit/test_validacao.py::test_usuario_sem_email PASSED                                                           [ 69%] 
tests/unit/test_validacao.py::test_usuario_sem_senha PASSED                                                           [ 76%] 
tests/unit/test_validacao.py::test_criar_registro_saude_valido PASSED                                                 [ 84%]
tests/unit/test_validacao.py::test_registro_saude_sem_campos_obrigatorios PASSED                                      [ 92%] 
tests/unit/test_validacao.py::test_registro_saude_com_sintoma_opcional PASSED                                         [100%] 

===================================================== warnings summary ===================================================== 
venv\Lib\site-packages\pydantic\_internal\_config.py:323
  C:\Users\gsouz\ArquivosVSCode\Sistema Saúde Cardiaca\Sistema-de-Acompanhamento-de-Saude-Cardiaca\ssc\backend-ssc\venv\Lib\site-packages\pydantic\_internal\_config.py:323: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.11/migration/
    warnings.warn(DEPRECATION_MESSAGE, DeprecationWarning)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
============================================== 13 passed, 3 warnings in 0.98s ==============================================
```
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
