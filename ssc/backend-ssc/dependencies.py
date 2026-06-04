from models import db
from sqlalchemy.orm import sessionmaker

def pegar_sessao():
    try:
        Session = sessionmaker(bind=db) # Criando conexão com o db
        session = Session() # Criando uma instância da conexão
        yield session
    finally:
        session.close()