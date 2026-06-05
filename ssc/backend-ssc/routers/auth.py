from fastapi import APIRouter, Depends, HTTPException
from models import User, db
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from dependencies import pegar_sessao
from main import bcrypt_context, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import UserSchema, LoginSchema
from jose import jwt, JWTError

auth_router = APIRouter(prefix="/auth", tags=["auth"])

def create_token(id_user):
    data_expiracao = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    dic_info = {"sub": id_user, "exp": data_expiracao}
    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return encoded_jwt

def auth(email, senha, session):
    usuario = session.query(User).filter(User.email==email).first()
    if not usuario:
        return False
    elif not bcrypt_context.verify(senha, usuario.senha):
        return False
    return usuario

@auth_router.get("/")
async def home():
    """
    Docstring:
    Essa é a rota padrão de autenticação do sistema. 
    Ela pode ser usada para verificar se o sistema de autenticação está funcionando corretamente.
    """
    
    return {"message": "Você está na rota de autenticação!"}

@auth_router.post("/register")
async def register(user_schema: UserSchema, session: Session = Depends(pegar_sessao) ):
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
    
@auth_router.post("/login")
async def login(login_schema: LoginSchema, session: Session = Depends(pegar_sessao)):
    usuario = auth(login_schema.email, login_schema.senha, session)
    if not usuario:
        raise HTTPException(status_code=422, detail="E-mail não cadastrado")
    else:
        access_token = create_token(usuario.id)
        return {
            "access_token": access_token,
            "token_type": "Bearer"
        }