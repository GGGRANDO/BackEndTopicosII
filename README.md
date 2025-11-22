# BackEndTopicosII

Prerequisitos
- Node.js 18+ e npm
- PostgreSQL

Configuração
1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Garanta que o banco esteja disponível e as credenciais em `.env` estejam corretas.

Rodando em desenvolvimento
```powershell
cd "c:\Users\gugra\OneDrive\Área de Trabalho\TopicosII\a"
npm install
npm run dev
```

Observações
- O servidor lê `PORT` (ou `API_PORT` se preferir). Por padrão `3001`.
- A variável usada para assinatura de tokens é `TOKEN_KEY`.

Seed (usuário de teste)
1. Você pode criar um usuário de teste executando:
```powershell
npm run seed
```
2. As credenciais padrão são `admin` / `admin123` (configuráveis via `.env` com `SEED_USER_LOGIN` e `SEED_USER_PASSWORD`).