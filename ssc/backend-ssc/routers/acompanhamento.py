from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import RegistroSaude, User 
from schemas import RegistroSchema 
from dependencies import pegar_sessao, verificar_token
from typing import List


acompanhamento_router = APIRouter(prefix="/acompanhamento", tags=["acompanhamento"])


@acompanhamento_router.post("/")
async def registrar_acompanhamento(
    registro: RegistroSchema, 
    session: Session = Depends(pegar_sessao), 
    usuario_logado: User = Depends(verificar_token)
):
   
    novo_registro = RegistroSaude(
        usuario_id=usuario_logado.id,  
        pressao_arterial=registro.pressao_arterial,
        frequencia_cardiaca=registro.frequencia_cardiaca,
        nivel_oxigenacao=registro.nivel_oxigenacao,
        data=registro.data, # Atenção aqui!
        peso=registro.peso,
        sintomas=registro.sintomas
    )
    
   
    session.add(novo_registro)
    session.commit()
    
    session.refresh(novo_registro)
    
    
    return {
        "mensagem": "Acompanhamento cardíaco registrado com sucesso!",
        "id_registro": novo_registro.id
    }

@acompanhamento_router.get("/", response_model=List[RegistroSchema])
async def listar_acompanhamento(
    session: Session = Depends(pegar_sessao), 
    usuario_logado: User = Depends(verificar_token)
):
    historico = session.query(RegistroSaude)\
                       .filter(RegistroSaude.usuario_id == usuario_logado.id)\
                       .order_by(RegistroSaude.data.desc())\
                       .all()
    
    return historico
