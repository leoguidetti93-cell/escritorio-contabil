# Passos para publicar a V1.5

1. Substitua os arquivos do site no GitHub pelos arquivos desta pasta.
2. No Supabase, abra Edge Functions > `conteudo-oficial`.
3. Substitua o conteúdo pelo arquivo `supabase/functions/conteudo-oficial/index.ts` desta versão.
4. Faça Deploy da função.
5. Mantenha `Verify JWT with legacy secret` desligado, como já estava.
6. Abra o GitHub Pages e faça um recarregamento forçado (Ctrl+F5 no computador).

## Testes rápidos
- Menu troca de página sem empilhar tudo na Home.
- Botão WhatsApp do topo abre o atendimento geral.
- Contador IA abre com as duas opções iniciais.
- Financeiro abre o WhatsApp financeiro.
- Home mostra 3 notícias.
- Página Notícias mostra até 12 notícias.
- Formulários, IA de documentos, Telegram e e-mail continuam funcionando.
