from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserSchema(BaseModel):
    nome: str
    email: str
    celular: str
    senha: str
    data_nascimento: date
    sexo: str
    pais: str
    ativo: Optional[bool]
    admin: Optional[bool]

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: str
    senha: str

    class Config:
        from_attributes = True

class RegistroSchema(BaseModel):
    pressao_arterial: str
    frequencia_cardiaca: int
    nivel_oxigenacao: str
    data_consulta: date
    peso: int
    sintomas: Optional[str] = None 

    class Config:
        from_attributes = True