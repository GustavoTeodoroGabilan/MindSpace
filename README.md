# MindSpace (Dashboard) — Spring Boot + Oracle + Angular

Projeto do **Dashboard** com **Spring Boot (API REST)**, **Oracle (banco)** e **frontend em Angular**.

> O Dashboard utiliza o backend em `http://localhost:8080`.

## Visão Geral

- **Backend:** API REST em Spring Boot
- **Banco:** Oracle (produção) + H2 (desenvolvimento/testes)
- **Frontend:** Angular em `dashboard/`

## Como Executar

### 1) Backend (Spring Boot)

1. Verifique/ajuste o perfil em `src/main/resources/application*.properties`.
2. Rode:

```bash
ORACLE_USER=<usuario> ORACLE_PASSWORD=<senha> SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

O backend sobe em `http://localhost:8080`.

### 2) Frontend (Angular - Dashboard)

```bash
cd dashboard
npm install
npm run start   # ou: ng serve
```

Acesse:
- `http://localhost:4200`

## Endpoints REST Relevantes

### Autenticação (Dashboard)

O Dashboard autentica via **Basic Auth**:

```http
GET /auth/validate
Authorization: Basic <base64(username:password)>
```

## Estrutura do Projeto

```text
MindSpace/
├── pom.xml                              # Backend (Spring Boot)
├── src/main/java/com/mindmatch/pagamento/
│   ├── controller/                      # Controllers REST
│   ├── dto/                             # DTOs
│   ├── entities/                       # Entidades JPA
│   ├── repositories/                   # Repositórios JPA
│   └── service/                        # Casos de uso/lógica de negócio
├── src/main/resources/
│   ├── application*.properties         # Perfis (test/prod)
│   └── import.sql                      # Seeds para ambientes
├── dashboard/                           # Frontend Angular
└── sql/                                 # Scripts SQL/DER/PL-SQL
```

