from fastapi import APIRouter
from models import User, db
from sqlalchemy.orm import sessionmaker
from datetime import date

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.get("/")
async def auth():
    """
    Docstring:
    Essa é a rota padrão de autenticação do sistema. 
    Ela pode ser usada para verificar se o sistema de autenticação está funcionando corretamente.
    """
    
    return {"message": "Você está na rota de autenticação!"}

@auth_router.post("/register")
async def register(nome: str, email: str, senha: str, celular: str,data_nascimento: date, sexo: str, pais: str  ):
    Session = sessionmaker(bind=db) # Criando conexão com o db
    session = Session() # Criando uma instância da conexão
    usuario = session.query(User).filter(User.email==email).first()
    if usuario:
        # ja existe um usuário
        return {"mensagem": "esse email já está vinculado a um usuário"}
    else:
        # não existe usuário
        new_user = User(nome, email, celular, senha, data_nascimento, sexo, pais)
        session.add(new_user)
        session.commit()
        return {"mensagem": "usuário cadastrado com sucesso"}