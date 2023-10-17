# sotf-mods.com API

## Setup
First create a .env (you can clone .env.example) and fill the variables
```env
PORT=3002
BASE_URL="http://localhost:3002"
DATABASE_URL=
JWT_SECRET=
```

To setup the project run:

```bash
bun install
bunx prisma generate
```

If you don't have a database yet and you use docker run:

```bash
docker run --name kelvin_bot -e POSTGRES_PASSWORD=12345678 -d postgres
bunx prisma db push
```
and modify your .env
```env
DATABASE_URL=postgresql://postgres:12345678@127.0.0.1:5432/kelvin_bot
```

## Getting Started
To run the project run the following commands

```bash
bun run src/index.ts
```

## Development
To start the development server run:
```bash
bun run dev
```

## Caveats
If you are running on linux and issue an error with sharp you might solve it by running:
```bash
cd node_modules/sharp
bun install
```

Open http://localhost:3000/ with your browser to see the result.