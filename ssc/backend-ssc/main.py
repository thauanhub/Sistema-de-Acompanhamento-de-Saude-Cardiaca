# para rodar o backend: uvicorn main:app --reload

from fastapi import FastAPI

app = FastAPI()

from routers import auth

app.include_router(auth.auth_router)