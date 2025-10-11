import express, { Request, Response } from 'express';
import axios from 'axios';
const router = express.Router();

const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002'; // Correct port for vehicle-service

// Proxy all requests under /api/v1/unified-service/*
router.all('/*', async (req: Request, res: Response) => {
  try {
    const forwardUrl = `${VEHICLE_SERVICE_URL.replace(/\/+$/,'')}${req.baseUrl.replace(/\/+$/,'')}${req.path}`;
    // build axios config
    const config: any = {
      method: req.method as any,
      url: forwardUrl,
      headers: {
        ...req.headers,
        host: undefined,
      },
      data: req.body,
      params: req.query,
      timeout: 15000,
      validateStatus: () => true,
    };

    const response = await axios(config);
    res.status(response.status).set(response.headers).send(response.data);
  } catch (err: any) {
    console.error('[api-gateway] unified-service proxy error', err?.message || err);
    res.status(502).json({ success: false, message: 'Bad gateway' });
  }
});

export default router;