import { Request, Response } from 'express';
import Animal from '../models/Animal';
import { queueService } from '../services/queueService';

export const animalController = {
  async create(req: Request, res: Response) {
    try {
      const animal = new Animal(req.body);
      await animal.save();
      
      await queueService.sendMessage({
        type: 'ANIMAL_CREATED',
        animalId: animal._id,
        animalName: animal.name,
        farmId: animal.farmId
      });

      res.status(201).json(animal);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create animal' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { farmId } = req.query;
      const query = farmId ? { farmId } : {};
      const animals = await Animal.find(query).populate('farmId');
      res.json(animals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch animals' });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const animal = await Animal.findById(req.params.id).populate('farmId');
      if (!animal) {
        return res.status(404).json({ error: 'Animal not found' });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch animal' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const animal = await Animal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('farmId');
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal not found' });
      }

      await queueService.sendMessage({
        type: 'ANIMAL_UPDATED',
        animalId: animal._id,
        animalName: animal.name,
        farmId: animal.farmId
      });

      res.json(animal);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update animal' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const animal = await Animal.findByIdAndDelete(req.params.id);
      
      if (!animal) {
        return res.status(404).json({ error: 'Animal not found' });
      }

      await queueService.sendMessage({
        type: 'ANIMAL_DELETED',
        animalId: animal._id,
        animalName: animal.name,
        farmId: animal.farmId
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete animal' });
    }
  }
};
