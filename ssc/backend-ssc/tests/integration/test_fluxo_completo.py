def test_fluxo_completo_usuario(client):
    # 1. cria usuário
    payload = {
        "nome": "Fluxo",
        "email": "fluxo@email.com",
        "celular": "11999999999",
        "senha": "123456",
        "data_nascimento": "2000-01-01",
        "sexo": "M",
        "pais": "Brasil"
    }

    client.post("/auth/register", json=payload)

    # 2. login
    response_login = client.post("/auth/login", json={
        "email": "fluxo@email.com",
        "senha": "123456"
    })

    token = response_login.json()["access_token"]

    # 3. acessar rota protegida
    response = client.get(
        "/relatorios/resumo",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200