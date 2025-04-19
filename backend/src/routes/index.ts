import { Router, Request, Response } from 'express';
import { farmController } from '../controllers/farmController';
import { animalController } from '../controllers/animalController';

const router = Router();

// Farm routes
router.post('/farms', async (req: Request, res: Response) => {
  await farmController.create(req, res);
});

router.get('/farms', async (req: Request, res: Response) => {
  await farmController.getAll(req, res);
});

router.get('/farms/:id', async (req: Request, res: Response) => {
  await farmController.getOne(req, res);
});

router.put('/farms/:id', async (req: Request, res: Response) => {
  await farmController.update(req, res);
});

router.delete('/farms/:id', async (req: Request, res: Response) => {
  await farmController.delete(req, res);
});

// Animal routes
router.post('/animals', async (req: Request, res: Response) => {
  await animalController.create(req, res);
});

router.get('/animals', async (req: Request, res: Response) => {
  await animalController.getAll(req, res);
});

router.get('/animals/:id', async (req: Request, res: Response) => {
  await animalController.getOne(req, res);
});

router.put('/animals/:id', async (req: Request, res: Response) => {
  await animalController.update(req, res);
});

router.delete('/animals/:id', async (req: Request, res: Response) => {
  await animalController.delete(req, res);
});

export default router;
