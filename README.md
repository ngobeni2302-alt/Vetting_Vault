# Vetting_Vault

VettingVault onboarding scaffold with a React frontend and Spring Boot backend. The implementation separates the Candidate and Employer planes from the first screen and enforces role-aware backend boundaries with JWT-backed RBAC.

## Structure

- `frontend/`: React + Vite onboarding UI
- `backend/`: Spring Boot auth and validation API

## Frontend Flow

- Initial split view with `Candidate` and `Employer` role cards
- Candidate registration form:
  - Name
  - Surname
  - ID Number
  - Email Address
  - Phone Number
- Candidate login form:
  - Email Address
  - ID Number
- Employer registration form:
  - Company Name
  - Corporate Email
  - Work Phone Number
  - Secure Password
- Employer login form:
  - Corporate Email
  - Password

## Backend Security Design

- Separate endpoints by plane:
  - `POST /api/candidate/register`
  - `POST /api/candidate/login`
  - `GET /api/candidate/me`
  - `POST /api/employer/register`
  - `POST /api/employer/login`
  - `GET /api/employer/me`
- Spring Security route policy:
  - `/api/candidate/**` requires `ROLE_CANDIDATE`
  - `/api/employer/**` requires `ROLE_EMPLOYER`
- Successful login issues a signed JWT with role claim and expiry.
- Candidate ID numbers are constrained to exactly 13 digits to reject SQL-injection and XSS-style payloads before any business logic runs.
- Employer registration validates the domain against a disposable-email blocklist.
- Blocked employer registration throws a dedicated security exception handled globally.
- The global exception handler writes raw telemetry to stderr in this format:
  - `timestamp=<iso-date> attemptedEmail=<email> action=BLOCKED`

## Key Files

- Backend security config: [SecurityConfig.java](/home/mlambya/Desktop/Vetting_Vault/backend/src/main/java/com/vettingvault/security/SecurityConfig.java)
- JWT service: [JwtService.java](/home/mlambya/Desktop/Vetting_Vault/backend/src/main/java/com/vettingvault/security/JwtService.java)
- Candidate validator annotation: [ValidCandidateIdNumber.java](/home/mlambya/Desktop/Vetting_Vault/backend/src/main/java/com/vettingvault/security/annotation/ValidCandidateIdNumber.java)
- Employer disposable email validator: [DisposableEmailDomainValidator.java](/home/mlambya/Desktop/Vetting_Vault/backend/src/main/java/com/vettingvault/employer/service/DisposableEmailDomainValidator.java)
- Global exception telemetry handler: [GlobalExceptionHandler.java](/home/mlambya/Desktop/Vetting_Vault/backend/src/main/java/com/vettingvault/telemetry/GlobalExceptionHandler.java)
- React onboarding app: [App.jsx](/home/mlambya/Desktop/Vetting_Vault/frontend/src/App.jsx)

## Running

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The current persistence layer is in-memory to keep the scaffold focused on onboarding and security flow design.
- Replace the demo JWT secret in `backend/src/main/resources/application.yml` before using this beyond local development.
