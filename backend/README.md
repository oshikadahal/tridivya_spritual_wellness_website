# Backend

Express + TypeScript backend for Tridivya Wellness.

Endpoints:
- POST /api/auth/register
- POST /api/auth/login

Register request body example (JSON):
```
{
  "email": "test@test.com",
  "username": "test",
  "password": "passpass",
  "confirmPassword": "passpass",
  "firstName": "Mero Name",
  "lastName": "Mero last name"
}
```

Login request body example (JSON):
```
{
  "email": "test@test.com",
  "password": "passpass"
}
```

Run locally:
1. Copy `.env.example` to `.env` and set values.
2. npm install
3. npm run dev

Postman collection: `postman_collection.json`
