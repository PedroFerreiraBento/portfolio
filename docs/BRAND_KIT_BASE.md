# Brand Kit Base - Fase 1

Aplicacao da Fase 1 no projeto `Portifolio`.

## Estrutura aplicada

- Logos: `brand/logo/`
- Cores: `brand/colors/tokens-colors.json`
- Tipografia: `brand/typography/type-scale.md`

## Disponibilizacao para o app

- Logos tambem copiados para uso web direto em:
- `app/public/brand/logo/`

Exemplo de uso no frontend:

```text
/brand/logo/logo_horizontal_brand_light_none_4x1_v01.svg
```

## Integracao no CSS do app

Arquivo alterado: `app/src/index.css`

- Cor primaria da marca alinhada para `#f59a2b`
- Paleta base alinhada aos tokens de `brand/colors`
- Tipografia base aplicada:
- Titulos: `Sora`
- Texto/UI: `Manrope`
- Font import adicionado via Google Fonts
- Ajustes em sombras/gradientes para a nova tonalidade da marca

## Observacao

Os tokens oficiais de cor e escala tipografica ficam centralizados em `brand/` como fonte de verdade para novas paginas/componentes.
