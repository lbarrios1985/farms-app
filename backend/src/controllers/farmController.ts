import { Request, Response } from 'express';
import Farm from '../models/Farm';
import { queueService } from '../services/queueService';

export const farmController = {
  async create(req: Request, res: Response) {
    try {
      const farm = new Farm(req.body);
      await farm.save();
      
      await queueService.sendMessage({
        type: 'FARM_CREATED',
        farmId: farm._id,
        farmName: farm.name
      });

      res.status(201).json(farm);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create farm' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const farms = await Farm.find();
      res.json(farms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch farms' });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const farm = await Farm.findById(req.params.id);
      if (!farm) {
        return res.status(404).json({ error: 'Farm not found' });
      }
      res.json(farm);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch farm' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const farm = await Farm.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      if (!farm) {
        return res.status(404).json({ error: 'Farm not found' });
      }

      await queueService.sendMessage({
        type: 'FARM_UPDATED',
        farmId: farm._id,
        farmName: farm.name
      });

      res.json(farm);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update farm' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const farm = await Farm.findByIdAndDelete(req.params.id);
      
      if (!farm) {
        return res.status(404).json({ error: 'Farm not found' });
      }

      await queueService.sendMessage({
        type: 'FARM_DELETED',
        farmId: farm._id,
        farmName: farm.name
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete farm' });
    }
  }
};
