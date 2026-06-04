from fastapi import APIRouter, Depends, HTTPException
from models import User, db
from sqlalchemy.orm import Session
from datetime import date
from dependencies import pegar_sessao
from main import bcrypt_context
from schemas import UserSchema

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
async def register(user_schema: UserSchema, session = Depends(pegar_sessao) ):
    usuario = session.query(User).filter(User.email==user_schema.email).first()
    if usuario:
        raise HTTPException(status_code=422, detail="E-mail já está vinculado a uma conta")
    else:
        # não existe usuário
        senha_cript = bcrypt_context.hash(user_schema.senha)
        new_user = User(user_schema.nome, user_schema.email, user_schema.celular, senha_cript, user_schema.data_nascimento, user_schema.sexo, user_schema.pais)
        session.add(new_user)
        session.commit()
        return {"mensagem": f"usuário com email:{user_schema.email} cadastrado com sucesso"}