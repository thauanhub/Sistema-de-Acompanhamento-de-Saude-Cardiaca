from fastapi import Depends, HTTPException
from models import db, User
from sqlalchemy.orm import sessionmaker, Session
from jose import jwt, JWTError
from main import SECRET_KEY, ALGORITHM, oauth2_schema

def pegar_sessao():
    try:
        Session = sessionmaker(bind=db) # Criando conexão com o db
        session = Session() # Criando uma instância da conexão
        yield session
    finally:
        session.close()

def verificar_token(token: str = Depends(oauth2_schema), session: Session = Depends(pegar_sessao)):
    try:
        dic_info = jwt.decode(token, SECRET_KEY, ALGORITHM)
        id_user = int(dic_info.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Acesso Negado, verifique a validade do token.")
    user = session.query(User).filter(user.id==id_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Acesso Inválido.")
    return user