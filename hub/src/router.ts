import { IncomingMessage, ServerResponse } from 'http';

type Handler = (req: IncomingMessage, res: ServerResponse, params: Record<string, string>, query: Record<string, string>) => void;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: Handler) {
    this.addRoute('GET', path, handler);
  }

  private addRoute(method: string, path: string, handler: Handler) {
    const paramNames: string[] = [];
    const pattern = path.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({ method, pattern: new RegExp(`^${pattern}$`), paramNames, handler });
  }

  handle(req: IncomingMessage, res: ServerResponse): boolean {
    const [pathname, qs] = (req.url || '/').split('?');
    const query: Record<string, string> = {};
    if (qs) {
      for (const pair of qs.split('&')) {
        const [k, v] = pair.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      }
    }

    for (const route of this.routes) {
      if (req.method !== route.method) continue;
      const m = pathname.match(route.pattern);
      if (!m) continue;
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
      route.handler(req, res, params, query);
      return true;
    }
    return false;
  }
}
