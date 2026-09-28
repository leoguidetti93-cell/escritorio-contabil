# Guidetti Contábil V1.2

Correções:
- evita erro `Cannot read properties of null (reading 'reset')`;
- mantém referência do formulário antes do `await`;
- desabilita o botão durante o envio para evitar solicitações duplicadas;
- mostra protocolo de sucesso;
- restaura corretamente o tipo de formulário após limpar os campos;
- atualiza cache do `app.js` para `v=4`.

A Edge Function e os secrets do Supabase não precisam ser alterados.
