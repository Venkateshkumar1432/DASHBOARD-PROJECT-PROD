
import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const vehicleServiceUrl = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002';

router.use('/', createProxyMiddleware({
  target: vehicleServiceUrl,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // This will remove the leading /api/v1/analytics from the path
    // and leave the rest, so it can be forwarded to the vehicle service
    return path.replace(req.baseUrl, '');
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to: ${vehicleServiceUrl}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
    res.status(500).json({ message: 'Proxy error', error: err.message });
  }
}));

export default router;
