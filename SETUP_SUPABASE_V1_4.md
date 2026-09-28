# Supabase — passos da V1.4

## 1. Criar cache do portal
No Supabase, abra **SQL Editor**, crie uma consulta nova, cole todo o conteúdo de `supabase/SQL_PORTAL_CACHE.sql` e execute.

## 2. Atualizar enviar-solicitacao
Em Edge Functions > `enviar-solicitacao`, substitua o código pelo arquivo:
`supabase/functions/enviar-solicitacao/index.ts`
Depois faça Deploy.

## 3. Atualizar extrair-documentos-admissao
Em Edge Functions > `extrair-documentos-admissao`, substitua o código pelo arquivo:
`supabase/functions/extrair-documentos-admissao/index.ts`
Depois faça Deploy.

## 4. Criar conteudo-oficial
Crie uma nova Edge Function com o nome exato:
`conteudo-oficial`
Cole o conteúdo de:
`supabase/functions/conteudo-oficial/index.ts`
Faça Deploy e deixe **Verify JWT with legacy secret = OFF**.

## 5. Secrets
A V1.4 reaproveita os secrets já existentes. Para notícias com resumo por IA é usado `OPENAI_API_KEY`.
Nenhuma nova chave é necessária para ViaCEP nem para as páginas oficiais do gov.br.

## 6. GitHub
Suba todos os arquivos da raiz do pacote no repositório do site, preservando as pastas `assets`, `data` e `supabase`.
O navegador é forçado a buscar `styles.css?v=6` e `app.js?v=6` para evitar cache antigo.
