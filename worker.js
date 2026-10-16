export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/products" && request.method === "GET") {
      const data = await env.PRODUCTS_KV.get("products");
      return json(data ? JSON.parse(data) : null);
    }

    if (url.pathname === "/api/products" && request.method === "PUT") {
      if (request.headers.get("X-Admin-Password") !== env.ADMIN_PASSWORD) {
        return json({ error: "unauthorized" }, 401);
      }
      const body = await request.text();
      JSON.parse(body);
      await env.PRODUCTS_KV.put("products", body);
      return json({ ok: true });
    }

    if (url.pathname === "/admin") {
      return env.ASSETS.fetch(new Request(new URL("/admin.html", request.url), request));
    }

    return env.ASSETS.fetch(request);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}