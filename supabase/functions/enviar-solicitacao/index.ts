import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const safe = (v: unknown) => String(v ?? "").replace(/[<>]/g, "").trim();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const b = await req.json();
    const protocolo = `GUI-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    const text = `📥 NOVA SOLICITAÇÃO • ${protocolo}\nTipo: ${safe(b.tipo)}\nEmpresa: ${safe(b.empresa)}\nCNPJ: ${safe(b.cnpj)}\nResponsável: ${safe(b.responsavel)}\nE-mail: ${safe(b.email)}\nTelefone: ${safe(b.telefone)}\nData desejada: ${safe(b.data)}\n\nDetalhes:\n${safe(b.detalhes)}`;

    const bot = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chat = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!bot || !chat) throw new Error("Telegram não configurado no Supabase");

    const tg = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    const tgData = await tg.json().catch(() => ({}));
    if (!tg.ok || tgData?.ok === false) {
      throw new Error(`Falha no Telegram: ${tgData?.description || tg.status}`);
    }

    const resend = Deno.env.get("RESEND_API_KEY");
    const to = Deno.env.get("REQUEST_EMAIL_TO");
    const from = Deno.env.get("REQUEST_EMAIL_FROM");
    let emailEnviado = false;

    if (resend && to && from) {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Guidetti • ${safe(b.tipo)} • ${protocolo}`,
          text,
        }),
      });
      emailEnviado = er.ok;
    }

    return new Response(JSON.stringify({ ok: true, protocolo, telegram: true, email: emailEnviado }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
