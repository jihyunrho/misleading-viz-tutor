# Misleading Data Visualization Tutor using LLM

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting the Environment Variable

If running locally, create a `.env` file in the project directory with the following content:

```
DATABASE_URL="postgresql://user:password@localhost:5432/database"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

## Adding a Visualization Image

1. Add the image file to `assets/visualizations` directory.
2. Add an entry to `data/visualizations-images.ts` file.

```typescript
export const visualizationImages: VisualizationImage[] = [
  {
    imageTitle: "3D Pie Chart of Mobile Devices Market Share",
    imageFilename: "3d_pie_phones.png",
    misleadingFeature: "3D effect",
  },
  {
    ... NEW IMAGE ENTRY HERE
  }
]
```

## Changing the Database schema

To change the Postgres database schema via the Drizzle ORM, modify the `db/schema.ts` file.

Then, run the following command to apply the changes to the database without creating a migration file:

```bash
npx drizzle-kit push
```
