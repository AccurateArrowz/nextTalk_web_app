# Backend

Express.js + TypeScript backend scaffold with a layered architecture.

## Layers

- `routes`: request entrypoints
- `controllers`: HTTP translation and response handling
- `services`: business logic
- `repositories`: persistence/data access boundary
- `dtos`: request/response shapes
- `middleware`: cross-cutting request handling
- `config`: environment and app configuration

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`

## Notes

Install dependencies before running the scripts:

```bash
npm install
```

