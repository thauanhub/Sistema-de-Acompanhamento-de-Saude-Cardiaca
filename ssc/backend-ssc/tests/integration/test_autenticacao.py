import uuid
# Importação para gerar um e-mail aleatório toda vez que o teste rodar

def test_rota_auth_home(client):
    response = client.get("/auth/")
    
    assert response.status_code == 200
    assert response.json() == {
        "message": "Você está na rota de autenticação!"
    }


def test_registro_usuario_novo(client):
    # Gerando um e-mail dinâmico para não dar erro de "e-mail já cadastrado" ao rodar o pytest várias vezes
    email_dinamico = f"paciente_{uuid.uuid4()}@email.com"
    
    payload = {
        "nome": "Paciente Teste",
        "email": email_dinamico,
        "celular": "11999999999",
        "senha": "senhaforte123",
        "data_nascimento": "1990-05-15",
        "sexo": "M",
        "pais": "Brasil",
        "ativo": True,
        "admin": False
    }
    
    response = client.post("/auth/register", json=payload)
    
    assert response.status_code == 200
    assert "cadastrado com sucesso" in response.json()["mensagem"]

def test_login_usuario_inexistente(client):
    # Testa se a API bloqueia logins falsos com segurança
    payload = {
        "email": "hacker@email.com",
        "senha": "senhaincorreta"
    }
    
    response = client.post("/auth/login", json=payload)
    
    # O FastAPI costuma retornar 422 para erros de validação da sua exceção customizada no router
    assert response.status_code == 422
    assert response.json()["detail"] == "E-mail não cadastrado"