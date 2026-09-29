# GUIDETTI CONTÁBIL — V1.5

## O que mudou
- Home muito mais curta e compacta.
- Conteúdos passaram a funcionar como páginas internas: Início, Insights, Notícias, Calendário, Formulários e Nossa História.
- Menu "Sobre" substituído por "Nossa História".
- História completa do escritório incluída em página própria.
- Resumo institucional moderno no final da Home.
- Apenas 3 notícias em destaque na Home.
- Página Notícias preparada para até 12 itens relevantes.
- Cache de notícias: Home até 24h; página Notícias até 48h.
- Botão de WhatsApp no menu superior.
- WhatsApp geral: +55 19 3892-7600.
- WhatsApp financeiro: +55 19 99765-0995.
- Contador IA permanece apenas no botão flutuante.
- Abertura do Contador IA em formato de chatbot:
  - Quero tirar uma dúvida rápida
  - Falar com um especialista
- Categorias da dúvida rápida:
  - Tributária / Fiscal
  - Trabalhista
  - Empresarial
  - MEI
  - Outros assuntos
  - Financeiro
- Financeiro direciona diretamente ao WhatsApp específico do setor.
- Opção de falar com especialista continua disponível dentro da conversa da IA.
- Visual geral reduzido: hero, títulos, cards, espaçamentos, formulários, calendário e rodapé mais compactos.

## Atualização necessária no Supabase
Atualize somente a Edge Function `conteudo-oficial` usando:
`supabase/functions/conteudo-oficial/index.ts`

As funções `contador-ia`, `enviar-solicitacao` e `extrair-documentos-admissao` não precisam ser alteradas nesta versão.
