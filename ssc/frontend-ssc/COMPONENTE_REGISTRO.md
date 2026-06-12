# Componente de Registro - Sistema de Acompanhamento de Saúde Cardíaca

## 📋 Descrição

Componente completo de registro de usuários para o frontend Ionic Angular. Inclui validações de formulário, tratamento de erros e integração com serviço de autenticação.

## 📁 Estrutura dos Arquivos Criados

```
src/app/
├── registro/
│   ├── registro.page.ts          # Lógica do componente
│   ├── registro.page.html        # Template
│   ├── registro.page.scss        # Estilos
│   ├── registro.page.spec.ts     # Testes
│   ├── registro.module.ts        # Módulo
│   └── registro-routing.module.ts # Roteamento
└── services/
    ├── auth.service.ts           # Serviço de autenticação
    └── auth.interceptor.ts       # Interceptor HTTP
```

## 🎯 Funcionalidades

✅ Validação de formulário reativa  
✅ Campos: Nome, Email, Data de Nascimento, Gênero, CPF, Telefone, Senha  
✅ Formatação automática de CPF e Telefone  
✅ Verificação se as senhas são iguais  
✅ Toggle de visibilidade de senha  
✅ Aceitar termos e condições  
✅ Mensagens de erro por campo  
✅ Loading durante o envio  
✅ Integração com serviço de autenticação

## 🚀 Como Usar

### 1. Acessar o Componente

A rota do registro foi adicionada ao roteamento principal:

```
http://localhost:4200/registro
```

### 2. Implementar o Serviço de Autenticação

No seu backend, configure um endpoint para registro:

```python
# backend-ssc/routers/auth.py
@router.post("/registro")
async def registrar_usuario(dados: RegistroSchema):
    # Validar dados
    # Criptografar senha
    # Salvar usuário no banco
    return {"access_token": token, "user": usuario}
```

### 3. Atualizar URL da API

No arquivo [src/app/services/auth.service.ts](src/app/services/auth.service.ts), atualize a URL da API:

```typescript
private apiUrl = 'http://localhost:8000/api'; // Ajuste conforme sua configuração
```

### 4. Usar o Serviço no Componente

O componente já está configurado para usar o `AuthService`. Ao submeter o formulário, ele fará uma chamada para:

```typescript
this.authService.registrar(dadosRegistro).subscribe(
  (response) => {
    // Sucesso
  },
  (error) => {
    // Erro
  },
);
```

## 📝 Schema de Dados Esperado

O backend deve esperar e retornar dados neste formato:

### Requisição:

```json
{
  "nome_completo": "João Silva",
  "email": "joao@email.com",
  "data_nascimento": "1990-05-15",
  "genero": "masculino",
  "cpf": "123.456.789-00",
  "telefone": "(11) 99999-9999",
  "senha": "SenhaSegura123"
}
```

### Resposta (Sucesso):

```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "nome_completo": "João Silva"
  }
}
```

### Resposta (Erro):

```json
{
  "message": "Email já cadastrado"
}
```

## 🔒 Validações Implementadas

| Campo              | Validações                           |
| ------------------ | ------------------------------------ |
| Nome Completo      | Obrigatório, mínimo 3 caracteres     |
| Email              | Obrigatório, formato válido          |
| Data de Nascimento | Obrigatória                          |
| Gênero             | Obrigatório                          |
| CPF                | Obrigatório, formato 000.000.000-00  |
| Telefone           | Obrigatório, formato (00) 00000-0000 |
| Senha              | Obrigatória, mínimo 8 caracteres     |
| Confirmar Senha    | Deve ser igual à senha               |
| Termos             | Deve ser aceito                      |

## 🎨 Personalizações

### Cores e Estilos

Os estilos utilizam variáveis do Ionic. Para personalizar:

Edite [src/theme/variables.scss](src/theme/variables.scss):

```scss
--ion-color-primary: #3880ff;
--ion-color-medium: #989aa2;
// ... outras variáveis
```

### Campos Adicionais

Para adicionar mais campos, edite [registro.page.ts](registro.page.ts):

```typescript
novosCampo: ["", [Validators.required]];
```

E adicione o input no [registro.page.html](registro.page.html).

## 🔧 Integração com Backend

Exemplo de como implementar no backend:

```python
from fastapi import APIRouter
from schemas import RegistroSchema
from security import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/registro")
async def registrar(dados: RegistroSchema, db: Session = Depends(get_db)):
    # Verificar se email já existe
    usuario_existente = db.query(Usuario).filter(
        Usuario.email == dados.email
    ).first()

    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Criar usuário
    novo_usuario = Usuario(
        nome_completo=dados.nome_completo,
        email=dados.email,
        cpf=dados.cpf,
        telefone=dados.telefone,
        data_nascimento=dados.data_nascimento,
        genero=dados.genero,
        senha=hash_password(dados.senha)
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    # Gerar token
    token = create_access_token(data={"sub": novo_usuario.email})

    return {
        "access_token": token,
        "user": novo_usuario
    }
```

## 📱 Responsividade

O componente é totalmente responsivo e funciona bem em:

- Smartphones
- Tablets
- Desktops

## 🧪 Testes

Para testar o componente:

```bash
ng test
```

O arquivo [registro.page.spec.ts](registro.page.spec.ts) contém os testes básicos.

## ❓ Dúvidas Frequentes

**P: Como mudar a URL da API?**  
R: Edite a variável `apiUrl` no arquivo [auth.service.ts](src/app/services/auth.service.ts).

**P: Posso adicionar mais campos?**  
R: Sim! Adicione no formulário e no schema de dados.

**P: Como integrar com redes sociais?**  
R: Crie novos métodos no `AuthService` para cada provedor.

**P: O componente suporta upload de foto?**  
R: Você pode adicionar um campo de upload expandindo o formulário.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do Ionic e Angular:

- [Ionic Docs](https://ionicframework.com/docs)
- [Angular Docs](https://angular.io/docs)
