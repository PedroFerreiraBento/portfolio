# Type Scale - Caos Domado (v01)

Objetivo: padronizar tipografia para materiais, templates HTML e interfaces com leitura forte em contexto B2B tecnico.

## 1) Familias tipograficas

- Titulos: `Sora`
- Texto/UI: `Manrope`

Fallback recomendado:

- Titulos: `"Sora", "Segoe UI", "Helvetica Neue", Arial, sans-serif`
- Texto/UI: `"Manrope", "Segoe UI", "Helvetica Neue", Arial, sans-serif`

Racional rapido:

- `Sora` traz personalidade tecnica/contemporanea para headlines sem perder legibilidade.
- `Manrope` funciona muito bem em UI, paragrafos e densidade de informacao.

## 2) Estilos fixos

Base considerada: `1rem = 16px`.

| Token | Familia | Weight | Size | Line-height | Tracking |
|---|---|---:|---:|---:|---:|
| H1 | Sora | 700 | 56px / 3.5rem | 1.10 | -0.02em |
| H2 | Sora | 700 | 40px / 2.5rem | 1.15 | -0.015em |
| H3 | Sora | 600 | 30px / 1.875rem | 1.20 | -0.01em |
| Body | Manrope | 400 | 18px / 1.125rem | 1.60 | 0em |
| Small | Manrope | 400 | 14px / 0.875rem | 1.50 | 0.005em |
| Label | Manrope | 600 | 12px / 0.75rem | 1.30 | 0.08em |
| Button | Manrope | 600 | 16px / 1rem | 1.20 | 0.02em |

## 3) Regras minimas de espacamento de texto

- Min line-height:
- Titulos (`H1-H3`): nunca abaixo de `1.10`
- Texto corrido (`Body`): nunca abaixo de `1.50`
- UI curta (`Small`, `Label`, `Button`): nunca abaixo de `1.20`

- Min tracking:
- Titulos: entre `-0.02em` e `0em`
- Body: `0em` (evitar tracking negativo)
- Label: minimo `0.06em` para caixa alta
- Button: entre `0.01em` e `0.03em`

## 4) Escala responsiva recomendada

- Mobile:
- H1 `40px`
- H2 `32px`
- H3 `24px`
- Body `16px`
- Small `13px`

- Desktop:
- H1 `56px`
- H2 `40px`
- H3 `30px`
- Body `18px`
- Small `14px`

## 5) Snippet CSS rapido

```css
:root {
  --font-heading: "Sora", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-ui: "Manrope", "Segoe UI", "Helvetica Neue", Arial, sans-serif;

  --text-h1: 3.5rem;
  --text-h2: 2.5rem;
  --text-h3: 1.875rem;
  --text-body: 1.125rem;
  --text-small: 0.875rem;
  --text-label: 0.75rem;
  --text-button: 1rem;
}
```

## 6) Import de fonte (web)

```css
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@600;700&display=swap");
```
