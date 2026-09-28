# Guidetti Contábil V1.1 — correção de integração

Este pacote corrige a integração do frontend com as Edge Functions do Supabase:

- configuração do Supabase embutida no `index.html`;
- remoção do uso incorreto da Publishable Key como Bearer JWT;
- cache-busting do `app.js`;
- mensagens de erro mais úteis;
- `supabase/config.toml` com `verify_jwt = false` para as funções públicas;
- função `enviar-solicitacao` revisada com validação da resposta do Telegram.

## Importante
Subir os arquivos no GitHub atualiza o site. A Edge Function já criada no Supabase precisa usar o novo `index.ts` e estar configurada sem verificação JWT para chamadas públicas.
