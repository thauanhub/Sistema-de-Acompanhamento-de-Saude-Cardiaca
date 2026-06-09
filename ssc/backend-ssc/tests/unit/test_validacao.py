from schemas import UserSchema, RegistroSchema
from datetime import date
import pytest

def test_criar_usuario_valido():
    user = UserSchema(
        nome="Gabriel",
        email="gabriel@email.com",
        celular="21999999999",
        senha="123456",
        data_nascimento=date(2000, 1, 1),
        sexo="M",
        pais="Brasil"
    )

    assert user.email == "gabriel@email.com"


def test_usuario_sem_email():
    with pytest.raises(Exception):
        UserSchema(
            nome="Gabriel",
            email=None,
            celular="21999999999",
            senha="123456",
            data_nascimento=date(2000, 1, 1),
            sexo="M",
            pais="Brasil"
        )


def test_usuario_sem_senha():
    with pytest.raises(Exception):
        UserSchema(
            nome="João",
            email="joao@email.com",
            celular="999999999",
            senha=None,
            data_nascimento=date(2000,1,1),
            sexo="M",
            pais="Brasil"
        )

def test_criar_registro_saude_valido():
    registro = RegistroSchema(
        pressao_arterial="120/80",
        frequencia_cardiaca=75,
        nivel_oxigenacao=98,
        data=date(2023, 10, 25),
        peso=75.5,
        sintomas="Nenhum"
    )
    assert registro.pressao_arterial == "120/80"
    assert getattr(registro, "frequencia_cardiaca") == 75

def test_registro_saude_sem_campos_obrigatorios():
    # Deve falhar porque a frequência cardíaca e oxigenação são obrigatórios no schema
    with pytest.raises(Exception):
        RegistroSchema(
            pressao_arterial="120/80",
            data=date(2023, 10, 25),
            peso=75.5
            # Faltando frequencia_cardiaca e nivel_oxigenacao propositalmente
        )

def test_registro_saude_com_sintoma_opcional():
    # Testa se o campo opcional 'sintomas' funciona quando não é enviado
    registro = RegistroSchema(
        pressao_arterial="130/85",
        frequencia_cardiaca=80,
        nivel_oxigenacao=95,
        data=date.today(),
        peso=80.0
    )
    assert registro.sintomas is None