# Guidetti Contábil V1.3

## Depois de subir no GitHub
Atualize a Edge Function `enviar-solicitacao` no Supabase com o novo arquivo e crie uma Edge Function pública chamada `extrair-documentos-admissao` usando o arquivo correspondente. Em ambas, deixe **Verify JWT with legacy secret = OFF**.

Os secrets já existentes são suficientes: `OPENAI_API_KEY`, Telegram e Resend. Opcionalmente, crie `OPENAI_VISION_MODEL`; se não existir, a função usa `gpt-5.6-luna`.

## Limites iniciais
A leitura inteligente aceita até 8 imagens por admissão. O navegador reduz fotos grandes antes de enviar. O usuário deve revisar os dados extraídos antes do envio.
