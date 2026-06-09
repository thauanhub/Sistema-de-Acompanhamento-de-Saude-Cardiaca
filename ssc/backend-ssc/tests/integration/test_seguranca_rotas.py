def test_acesso_negado_sem_token_acompanhamento(client):
    # Tenta listar os acompanhamentos sem estar logado
    response = client.get("/acompanhamento/")
    
    # Deve retornar 401 Unauthorized
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_acesso_negado_sem_token_relatorios(client):
    # Tenta ver o resumo de saúde sem estar logado
    response = client.get("/relatorios/resumo")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_post_acompanhamento_sem_token(client):
    # Tenta registrar um acompanhamento cardíaco sem estar logado
    payload = {
        "pressao_arterial": "120/80",
        "frequencia_cardiaca": 70,
        "nivel_oxigenacao": 99,
        "data": "2023-11-01",
        "peso": 70.0
    }
    response = client.post("/acompanhamento/", json=payload)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"