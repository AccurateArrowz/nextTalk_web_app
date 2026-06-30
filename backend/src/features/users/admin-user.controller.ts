import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "@middleware/require-auth.js";
import { userService } from "@features/users/user.service.js";

function parsePagination(value: unknown, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(String(raw ?? fallback), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSearch(value: unknown) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" ? value : undefined;
}

function parseId(value: unknown) {
  return Array.isArray(value) ? value[0] : String(value);
}

export async function listAdminUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await userService.listUsers({
      page: parsePagination(req.query.page, 1),
      limit: parsePagination(req.query.limit, 10),
      search: parseSearch(req.query.search)
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await userService.getUserById(parseId(req.params.id));
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function createAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({ data: result, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await userService.updateUser(parseId(req.params.id), req.body);
    res.status(200).json({ data: result, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(parseId(req.params.id));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}
