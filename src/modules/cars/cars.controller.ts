import { Request, Response, NextFunction } from 'express';
import * as carsService from './cars.service';
import { CreateCarInput, UpdateCarInput } from './cars.schema';

export async function getCarsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cars = await carsService.getCars(req.userId);
    res.status(200).json({ data: cars });
  } catch (err) {
    next(err);
  }
}

export async function getCarHandler(
  req: Request<{ licensePlate: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const car = await carsService.getCar(req.params.licensePlate, req.userId);
    res.status(200).json({ data: car });
  } catch (err) {
    next(err);
  }
}

export async function createCarHandler(
  req: Request<object, object, CreateCarInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const car = await carsService.createCar(req.body, req.userId);
    res.status(201).json({ data: car, message: 'Car added' });
  } catch (err) {
    next(err);
  }
}

export async function updateCarHandler(
  req: Request<{ licensePlate: string }, object, UpdateCarInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const car = await carsService.updateCar(req.params.licensePlate, req.body, req.userId);
    res.status(200).json({ data: car });
  } catch (err) {
    next(err);
  }
}

export async function deleteCarHandler(
  req: Request<{ licensePlate: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await carsService.deleteCar(req.params.licensePlate, req.userId);
    res.status(200).json({ message: 'Car deleted' });
  } catch (err) {
    next(err);
  }
}
