# Integração Frontend Ionic Angular com Backend FastAPI

## 📋 Visão Geral

O frontend Ionic Angular foi integrado com sucesso ao backend FastAPI. A integração permite autenticação completa através de registro e login de usuários.

## 🔧 Configuração do Backend

### 1. **Instalar Dependências**

```bash
cd ssc/backend-ssc
pip install -r requirements.txt
```

### 2. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `backend-ssc`:

```env
SECRET_KEY=sua_chave_secreta_super_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///database/ssc.db
```

### 3. **Criar Database (se não existir)**

```bash
python -c "from models import Base, db; Base.metadata.create_all(db)"
```

### 4. **Rodar o Backend**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: `http://localhost:8000`

## 🚀 Configuração do Frontend

### 1. **Instalar Dependências**

```bash
cd ssc/frontend-ssc/ssc
npm install
```

### 2. **Rodar o Frontend**

```bash
ionic serve
```

O frontend estará disponível em: `http://localhost:8100`

## 📡 Endpoints do Backend Integrados

### Registro de Usuário

**Endpoint:** `POST /auth/register`

**Request:**

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "data_nascimento": "1990-05-15",
  "sexo": "M",
  "celular": "(11) 98765-4321",
  "pais": "Brasil",
  "senha": "SenhaSegura123"
}
```

**Response (Sucesso - 200):**

```json
{
  "mensagem": "usuário com email:joao@example.com cadastrado com sucesso"
}
```

**Response (Erro - 422):**

```json
{
  "detail": "E-mail já está vinculado a uma conta"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "joao@example.com",
  "senha": "SenhaSegura123"
}
```

**Response (Sucesso - 200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

**Response (Erro - 422):**

```json
{
  "detail": "E-mail não cadastrado"
}
```

## 🔐 Campos de Usuário

| Campo             | Tipo   | Obrigatório | Descrição                                    |
| ----------------- | ------ | ----------- | -------------------------------------------- |
| `nome`            | string | ✅          | Nome completo do usuário (mín. 3 caracteres) |
| `email`           | string | ✅          | Email único (validação de formato)           |
| `data_nascimento` | date   | ✅          | Data no formato YYYY-MM-DD                   |
| `sexo`            | string | ✅          | M (Masculino), F (Feminino), O (Outro)       |
| `celular`         | string | ✅          | Formato: (XX) XXXXX-XXXX                     |
| `pais`            | string | ✅          | País de residência                           |
| `senha`           | string | ✅          | Mín. 8 caracteres (criptografada com bcrypt) |

## 🛡️ Segurança

- **CORS:** Habilitado para aceitar requisições do frontend
- **Autenticação:** JWT (JSON Web Token)
- **Criptografia de Senha:** bcrypt
- **Token Expiration:** 30 minutos (configurável)

## 🔗 Fluxo de Autenticação

```
1. Usuário acessa Home
   ↓
2. Clica em "Criar Conta" → Vai para /registro
   ↓
3. Preenche dados e submete
   ↓
4. Frontend faz POST para /auth/register
   ↓
5. Se sucesso → Redireciona para /login
   ↓
6. Preenche email e senha
   ↓
7. Frontend faz POST para /auth/login
   ↓
8. Backend retorna access_token
   ↓
9. Frontend armazena token no localStorage
   ↓
10. Redireciona para /home (Autenticado)
```

## 📦 Serviço de Autenticação (Frontend)

Localização: `src/app/services/auth.service.ts`

### Métodos Disponíveis

```typescript
// Registrar novo usuário
authService.registrar(dados: RegistroRequest): Observable<AuthResponse>

// Fazer login
authService.login(dados: LoginRequest): Observable<AuthResponse>

// Fazer logout
authService.logout(): void

// Verificar se está autenticado
authService.estaAutenticado(): boolean

// Obter token
authService.obterToken(): string | null

// Obter usuário atual
authService.obterUsuarioAtual(): any
```

## 🧪 Teste Manual

### 1. Testar Registro

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste User",
    "email": "teste@example.com",
    "data_nascimento": "1990-01-01",
    "sexo": "M",
    "celular": "(11) 98765-4321",
    "pais": "Brasil",
    "senha": "SenhaSegura123"
  }'
```

### 2. Testar Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "SenhaSegura123"
  }'
```

## 🐛 Troubleshooting

### Erro: "Connection Refused"

- Verifique se o backend está rodando: `http://localhost:8000`
- Verifique a porta no `AuthService` (deve ser 8000)

### Erro: "E-mail já está vinculado"

- O email já foi registrado
- Use um email diferente ou delete o usuário do banco de dados

### Erro: "E-mail não cadastrado"

- O email não existe no banco de dados
- Certifique-se de que o email está correto

### CORS Errors

- O CORS deve estar configurado no backend (já está nessa versão)
- Se receber erro, verifique `main.py` na configuração de CORS

## 📝 Próximas Implementações

- [ ] Recuperação de senha
- [ ] Refresh token automático
- [ ] Autenticação por redes sociais
- [ ] Two-factor authentication (2FA)
- [ ] Profile management
- [ ] Histórico de acesso

## 📞 Suporte

Para dúvidas sobre:

- **Backend FastAPI:** Consulte a documentação em `http://localhost:8000/docs`
- **Frontend Ionic Angular:** Consulte a documentação em `http://localhost:8100`

---

**Versão:** 1.0  
**Última Atualização:** 2026-06-12
