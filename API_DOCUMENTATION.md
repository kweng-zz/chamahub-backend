# ChamaHub Backend API Documentation

## Base URL

- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://chamahub-backend.onrender.com/api/v1`

## Authentication

All endpoints (except health check) require Clerk authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <clerk_token>
```

## Health Check

### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 200

---

## Authentication Endpoints

### POST /auth/sync-user

Sync user with Clerk authentication.

**Headers:**
```
Authorization: Bearer <clerk_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "clerkId": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "id": "uuid",
  "clerkId": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 200 (OK) or 201 (Created)

---

## Chamas Endpoints

### GET /chamas

Get all chamas for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Chama Name",
    "description": "Description",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /chamas

Create a new chama.

**Request Body:**
```json
{
  "name": "Chama Name",
  "description": "Description"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Chama Name",
  "description": "Description",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

### GET /chamas/:id

Get a specific chama.

**Response:**
```json
{
  "id": "uuid",
  "name": "Chama Name",
  "description": "Description",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 200

### PUT /chamas/:id

Update a chama.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "description": "Updated Description",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 200

### DELETE /chamas/:id

Delete a chama.

**Status Code**: 204

---

## Members Endpoints

### GET /members

Get all members.

**Response:**
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /members

Create a new member.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

---

## Contributions Endpoints

### GET /contributions

Get all contributions.

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 1000,
    "memberId": "uuid",
    "chamaId": "uuid",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /contributions

Create a new contribution.

**Request Body:**
```json
{
  "amount": 1000,
  "memberId": "uuid",
  "chamaId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 1000,
  "memberId": "uuid",
  "chamaId": "uuid",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

---

## Loans Endpoints

### GET /loans

Get all loans.

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 5000,
    "memberId": "uuid",
    "chamaId": "uuid",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /loans

Create a new loan application.

**Request Body:**
```json
{
  "amount": 5000,
  "memberId": "uuid",
  "chamaId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 5000,
  "memberId": "uuid",
  "chamaId": "uuid",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

---

## Payments Endpoints

### GET /payments

Get all payments.

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 1000,
    "status": "completed",
    "memberId": "uuid",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /payments

Create a new payment.

**Request Body:**
```json
{
  "amount": 1000,
  "memberId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 1000,
  "status": "pending",
  "memberId": "uuid",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

---

## M-Pesa Endpoints

### POST /mpesa/stk-push

Initiate M-Pesa STK push for payment.

**Request Body:**
```json
{
  "phoneNumber": "254712345678",
  "amount": 1000,
  "accountReference": "CHAMA001",
  "transactionDescription": "Chama contribution"
}
```

**Response:**
```json
{
  "requestId": "16813-1590513-1",
  "responseCode": "0",
  "responseDescription": "Success. Request accepted for processing",
  "customerMessage": "Success. Request accepted for processing"
}
```

**Status Code**: 200

### POST /mpesa/callback

M-Pesa callback endpoint (called by M-Pesa, not by client).

**Status Code**: 200

---

## Meetings Endpoints

### GET /meetings

Get all meetings.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Monthly Meeting",
    "date": "2024-02-15T10:00:00.000Z",
    "chamaId": "uuid",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Code**: 200

### POST /meetings

Create a new meeting.

**Request Body:**
```json
{
  "title": "Monthly Meeting",
  "date": "2024-02-15T10:00:00.000Z",
  "chamaId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Monthly Meeting",
  "date": "2024-02-15T10:00:00.000Z",
  "chamaId": "uuid",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Code**: 201

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## CORS

CORS is enabled for the following origins:
- Development: `http://localhost:3000`, `http://localhost:3001`
- Production: Your Vercel frontend URL

---

## Testing

### Using cURL

```bash
# Health check
curl https://chamahub-backend.onrender.com/api/v1/health

# Get chamas (requires authentication)
curl -H "Authorization: Bearer <token>" \
  https://chamahub-backend.onrender.com/api/v1/chamas
```

### Using Postman

1. Import the API endpoints
2. Set up Bearer token authentication
3. Test each endpoint

---

## Support

For issues or questions about the API, please contact the development team.

---

**Last Updated**: January 2024
**API Version**: 1.0.0
