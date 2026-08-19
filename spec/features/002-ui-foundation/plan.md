# Plan · 002 UI Foundation

## Enfoque técnico

### 1. Tailwind CSS

Tailwind ya viene incluido con `create-next-app`. Configurar `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta cartográfica
        spice: {
          50: '#fdf8f0',
          100: '#faecd6',
          200: '#f5d5a8',
          300: '#efb970',
          400: '#e89a38',
          500: '#e48315',
          600: '#d5680b',
          700: '#b14d0c',
          800: '#8e3d12',
          900: '#753412',
        },
        earth: {
          50: '#f6f5f0',
          100: '#e8e5d8',
          200: '#d3ceb4',
          300: '#bab28a',
          400: '#a69a6b',
          500: '#978b5c',
          600: '#81724d',
          700: '#695940',
          800: '#584b3a',
          900: '#4d4235',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 2. shadcn/ui + Radix

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input
```

### 3. CSS Global

Crear `src/styles/globals.css` con variables CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 20 10% 10%;
  --card: 0 0% 100%;
  --card-foreground: 20 10% 10%;
  --primary: 24 75% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 36 20% 85%;
  --secondary-foreground: 36 20% 20%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --accent: 36 45% 60%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 24 75% 50%;
  --radius: 0.5rem;
}

.dark {
  --background: 20 10% 10%;
  --foreground: 0 0% 95%;
  --card: 20 10% 12%;
  --card-foreground: 0 0% 95%;
  --primary: 24 75% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 36 15% 20%;
  --secondary-foreground: 36 20% 90%;
  --muted: 20 10% 15%;
  --muted-foreground: 0 0% 65%;
  --accent: 36 45% 50%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 62% 50%;
  --destructive-foreground: 0 0% 100%;
  --border: 20 10% 20%;
  --input: 20 10% 20%;
  --ring: 24 75% 50%;
}
```

### 4. Tipografías

Agregar Google Fonts en `src/app/layout.tsx`:

```typescript
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-editorial' })
```

## Decisiones técnicas

1. **shadcn/ui sobre Material UI**: Más ligero, mejor personalización, usa Radix
2. **CSS variables**: Facilita modo claro/oscuro y theming
3. **Google Fonts**: Inter para UI, Merriweather para textos editoriales
4. **Tokens de color**: Basados en la paleta "especias" de la constitución

## Riesgos

- **Tamaño de bundle**: shadcn/ui es más ligero que alternativas, pero vigilar
- **Consistencia de tokens**: Documentar bien para futuros componentes
