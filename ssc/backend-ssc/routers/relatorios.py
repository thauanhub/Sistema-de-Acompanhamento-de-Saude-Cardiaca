from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from models import RegistroSaude, User
from dependencies import pegar_sessao, verificar_token

relatorios_router = APIRouter(
    prefix="/relatorios",
    tags=["relatorios"]
)


@relatorios_router.get("/resumo")
async def resumo_saude(
    session: Session = Depends(pegar_sessao),
    usuario_logado: User = Depends(verificar_token)
):
    total = session.query(RegistroSaude).filter(
        RegistroSaude.usuario_id == usuario_logado.id
    ).count()

    media_frequencia = session.query(
        func.avg(RegistroSaude.frequencia_cardiaca)
    ).filter(
        RegistroSaude.usuario_id == usuario_logado.id
    ).scalar()

    media_oxigenacao = session.query(
        func.avg(RegistroSaude.nivel_oxigenacao)
    ).filter(
        RegistroSaude.usuario_id == usuario_logado.id
    ).scalar()

    media_peso = session.query(
        func.avg(RegistroSaude.peso)
    ).filter(
        RegistroSaude.usuario_id == usuario_logado.id
    ).scalar()

    return {
        "total_registros": total,
        "media_frequencia_cardiaca": media_frequencia,
        "media_oxigenacao": media_oxigenacao,
        "media_peso": media_peso
    }


@relatorios_router.get("/ultimo")
async def ultimo_registro(
    session: Session = Depends(pegar_sessao),
    usuario_logado: User = Depends(verificar_token)
):

    ultimo = session.query(RegistroSaude).filter(
        RegistroSaude.usuario_id == usuario_logado.id
    ).order_by(
        RegistroSaude.data.desc()
    ).first()

    if not ultimo:
        return {
            "mensagem": "Nenhum registro encontrado"
        }

    return {
        "pressao_arterial": ultimo.pressao_arterial,
        "frequencia_cardiaca": ultimo.frequencia_cardiaca,
        "nivel_oxigenacao": ultimo.nivel_oxigenacao,
        "peso": ultimo.peso,
        "sintomas": ultimo.sintomas,
        "data": ultimo.data
    }