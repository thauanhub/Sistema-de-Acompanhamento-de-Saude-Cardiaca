from fastapi import APIRouter

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.get("/")
async def auth():
    """
    Docstring:
    Essa é a rota padrão de autenticação do sistema. 
    Ela pode ser usada para verificar se o sistema de autenticação está funcionando corretamente.
    """
    
    return {"message": "Você está na rota de autenticação!"}