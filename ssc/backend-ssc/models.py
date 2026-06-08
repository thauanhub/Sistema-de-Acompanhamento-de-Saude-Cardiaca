from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, ForeignKey, Float
from sqlalchemy.orm import declarative_base
from sqlalchemy_utils.types import ChoiceType
from sqlalchemy import Float

# Conexão com o bd
db = create_engine("sqlite:///database/ssc.db")

# Base do bd
Base = declarative_base() # Faz a tradução da classe do python para uma tabela no bd

# tabelas do bd
class User(Base):
    __tablename__ = "users" # nome da tabela no bd
    
    id = Column("id", Integer, primary_key=True, autoincrement=True) # id do usuário, chave primária e auto-incrementável
    nome = Column("nome", String(255), nullable=False) # nome do usuário, obrigatório
    email = Column("email", String(255), nullable=False, unique=True) # email do usuário, obrigatório e único
    celular = Column("celular", String(20), nullable=False) # celular do usuário, obrigatório
    senha = Column("senha", String(255), nullable=False) # senha do usuário, obrigatório
    data_nascimento = Column("data_nascimento", Date, nullable=False) # data de nascimento do usuário, obrigatório
    sexo = Column("sexo", String(10), nullable=False) # sexo do usuário, obrigatório
    pais = Column("pais", String(100), nullable=False) # país do usuário, obrigatório
    ativo = Column("ativo", Boolean, default=True) # status do usuário, ativo ou inativo, padrão é ativo
    admin = Column("admin", Boolean, default=False) # se o usuário é admin ou não, padrão é não admin
    
    def __init__(self, nome, email, celular, senha, data_nascimento, sexo, pais, ativo=True, admin=False):
        self.nome = nome
        self.email = email
        self.celular = celular
        self.senha = senha
        self.data_nascimento = data_nascimento
        self.sexo = sexo
        self.pais = pais
        self.ativo = ativo
        self.admin = admin

class RegistroSaude(Base):
    __tablename__ = "registro"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    usuario_id = Column("usuario_id", Integer, ForeignKey("users.id"), nullable=False)    
    pressao_arterial = Column("pressaoArterial", String(20), nullable= False)
    frequencia_cardiaca = Column("frequencia_cardiaca", Integer, nullable= False)
    nivel_oxigenacao = Column("nivel_oxigenacao", Integer, nullable=False)
    data = Column("data", Date, nullable=False) # Mudou aqui!
    peso = Column("peso", Float, nullable=False)
    sintomas= Column ("sintomas", String(255), nullable= True)

    # Mudou dentro dos parênteses:
    def __init__(self, usuario_id, pressao_arterial, frequencia_cardiaca, nivel_oxigenacao, data, peso, sintomas=None):
        self.usuario_id = usuario_id
        self.pressao_arterial = pressao_arterial
        self.frequencia_cardiaca = frequencia_cardiaca
        self.nivel_oxigenacao = nivel_oxigenacao
        self.data = data # Mudou aqui!
        self.peso = peso
        self.sintomas = sintomas