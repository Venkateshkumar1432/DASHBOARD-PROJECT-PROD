import { Router, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import http from 'http';
import { Socket } from 'net';

dotenv.config();

const router = Router();

const vehicleServiceUrl = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002';

router.use('/', createProxyMiddleware({
  target: vehicleServiceUrl,
  changeOrigin: true,
  pathRewrite: (path: string, req: Request) => {
    return path.replace(req.baseUrl, '');
  },
  on: {
    proxyReq: (proxyReq: http.ClientRequest, req: Request, res: Response) => {
      console.log(`[API Gateway] Proxying request to: ${vehicleServiceUrl}${proxyReq.path}`);
    },
    error: (err: Error, req: Request, res: Response | Socket) => {
      console.error('[API Gateway] Proxy error:', err);
      if (res instanceof http.ServerResponse) {
        res.status(500).json({ message: 'Proxy error', error: err.message });
      } else if (res instanceof Socket) {
        res.destroy();
      }
    }
  }
}));

export default router;
