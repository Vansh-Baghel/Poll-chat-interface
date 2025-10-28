from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    access_token: str
    id: int
    name: str
    email: str
