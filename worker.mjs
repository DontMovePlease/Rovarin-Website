export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Permanent redirect for www to apex domain, preserving path and query
    if (url.hostname === 'www.rovarinofficial.com') {
      url.hostname = 'rovarinofficial.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    // 2. Block abusive/training-only crawlers while allowing robots.txt inspection
    const ua = request.headers.get('user-agent') || '';
    const trainingBots = /\b(GPTBot|ClaudeBot|Google-Extended|CCBot|Bytespider|FacebookBot|Diffbot|cohere-ai)\b/i;
    if (trainingBots.test(ua) && url.pathname !== '/robots.txt') {
      return new Response('Access denied for training crawlers', {
        status: 403,
        headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' }
      });
    }

    // 3. Serve static assets
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    if (response.status >= 400) headers.set('X-Robots-Tag', 'noindex');
    return new Response(response.body, { status: response.status, headers });
  }
};