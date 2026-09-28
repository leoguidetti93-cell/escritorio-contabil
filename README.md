# Guidetti Contábil — Portal V1

Primeira base do novo site, pensada para **GitHub Pages + Supabase**, sem Render.

## O que já existe
- Home responsiva e moderna baseada nas cores/logos Guidetti.
- Atalhos rápidos.
- Áreas de Insights, Notícias e Calendário Tributário.
- Formulários de Admissão, Rescisão, Férias e Outras solicitações.
- Contador IA flutuante.
- Estrutura de Supabase Edge Functions para:
  - `contador-ia`: OpenAI via secret do Supabase.
  - `enviar-solicitacao`: Telegram + e-mail via Resend.
- Área Sobre e Contato pronta para receber dados reais.

## Publicação no GitHub Pages
Use branch `main` e pasta `/ (root)`.

## Antes de conectar o Supabase
O site funciona visualmente sem Supabase. `config.js` vem vazio de propósito.

Quando o projeto Supabase estiver criado, preencher `config.js` com URL e chave pública do projeto.

## Segurança
Nunca coloque no GitHub:
- `OPENAI_API_KEY`
- token do bot Telegram
- `service_role` do Supabase
- `RESEND_API_KEY`

Esses dados ficam em **Supabase Edge Function Secrets**.

## Próximos passos sugeridos
1. Ajustar história, contatos e serviços reais.
2. Definir calendário tributário real.
3. Configurar Supabase.
4. Configurar Contador IA.
5. Configurar Telegram/e-mail dos formulários.
6. Adicionar formulários específicos e anexos via Supabase Storage.
