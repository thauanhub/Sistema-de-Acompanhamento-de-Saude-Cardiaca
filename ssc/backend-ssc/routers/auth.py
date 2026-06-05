from fastapi import APIRouter, Depends, HTTPException
from models import User, db
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from dependencies import pegar_sessao, verificar_token
from main import bcrypt_context, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from schemas import UserSchema, LoginSchema
from jose import jwt, JWTError

auth_router = APIRouter(prefix="/auth", tags=["auth"])

def create_token(id_user, duracao_token=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    data_expiracao = datetime.now(timezone.utc) + duracao_token
    dic_info = {"sub": str(id_user), "exp": data_expiracao}
    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return encoded_jwt

def auth(email, senha, session):
    user = session.query(User).filter(User.email==email).first()
    if not user:
        return False
    elif not bcrypt_context.verify(senha, user.senha):
        return False
    return user

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
    user = session.query(User).filter(User.email==user_schema.email).first()
    if user:
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
    user = auth(login_schema.email, login_schema.senha, session)
    if not user:
        raise HTTPException(status_code=422, detail="E-mail não cadastrado")
    else:
        access_token = create_token(user.id)
        refresh_token = create_token(user.id, duracao_token=timedelta(days=7))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer"
        }
    
@auth_router.get("/refresh")
async def use_refresh_token(token):
    user = verificar_token(token)
    access_token = create_token(user.id)
    return {
            "access_token": access_token,
            "token_type": "Bearer"
        }