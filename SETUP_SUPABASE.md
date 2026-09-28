# Configuração futura do Supabase

Esta versão não exige Supabase para abrir no GitHub Pages.

Quando for configurar:

1. Criar novo projeto Supabase para Guidetti Contábil.
2. Copiar Project URL e Publishable/Anon key para `config.js`.
3. Criar secrets das Edge Functions:
   - OPENAI_API_KEY
   - OPENAI_MODEL (opcional; padrão gpt-5-mini)
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_CHAT_ID
   - RESEND_API_KEY
   - REQUEST_EMAIL_TO
   - REQUEST_EMAIL_FROM
4. Fazer deploy das funções:
   - contador-ia
   - enviar-solicitacao
5. Testar site, Telegram e e-mail.

Observação: anexos estão visualmente previstos, mas desabilitados nesta primeira versão. Vamos habilitar com Supabase Storage quando definirmos os documentos de cada formulário.
