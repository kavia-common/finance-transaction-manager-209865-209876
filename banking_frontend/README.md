# Remotion video + Banking Dashboard (Frontend)

This Remotion project now includes:
- Original Remotion compositions (HelloWorld, OnlyLogo)
- A lightweight React banking dashboard previewed inside Remotion Studio (Composition: BankingDashboardPreview)

The dashboard integrates with a FastAPI backend to authenticate, list accounts, view transactions and create new transactions.

## Configure environment

Create `.env` (or copy `.env.example`) and set the backend URL:
```bash
cp .env.example .env
# or create manually
```

Variables:
- VITE_BACKEND_API_URL: Preferred. Example `http://localhost:8000`

Notes:
- Ensure the backend FastAPI server is running on the configured host/port.
- The header shows the resolved API base URL for confirmation.

## Commands

Install dependencies:
```console
npm i
```

Start Remotion Studio:
```console
npm run dev
```
Open the "BankingDashboardPreview" composition to use the UI inside Studio.

Render a video (example with HelloWorld):
```console
npx remotion render
```

Upgrade Remotion:
```console
npx remotion upgrade
```

## Backend endpoints assumed

- POST /auth/login
- GET /auth/me
- GET /accounts
- GET /accounts/{id}
- GET /accounts/{id}/balance
- GET /transactions
- POST /transactions
- GET /transactions/{id}

## Notes

- Minimal client-side state via React hooks.
- Basic retry for network/server errors.
- Ocean Professional theme applied with subtle shadows and rounded corners.
- Remotion compositions are preserved.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
