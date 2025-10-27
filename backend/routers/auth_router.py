from fastapi import APIRouter
from schemas.user import LoginRequest, UserResponse, LogoutResponse, LogoutRequest
from services.auth_service import login_user

router = APIRouter(tags=["Auth"])

@router.post("/login", response_model=UserResponse)
def login(data: LoginRequest):
    return login_user(data.email, data.password)
