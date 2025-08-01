import { z } from 'zod';

// Whole number validation utilities
export const wholeNumberSchema = z.number().int().positive();

export const tokenQuantitySchema = z.object({
  totalSupply: wholeNumberSchema.min(1).max(1000000),
  availableSupply: z.number().int().min(0).max(1000000),
  quantity: wholeNumberSchema.min(1)
});

export const messageSchema = z.string().min(1).max(27);

// Frontend validation functions
export function validateWholeNumber(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isInteger(num) && num > 0;
}

export function validateTokenQuantity(quantity: any): { isValid: boolean; error?: string } {
  try {
    const num = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    
    if (isNaN(num) || !Number.isInteger(num)) {
      return { isValid: false, error: 'Must be a whole number' };
    }
    
    if (num <= 0) {
      return { isValid: false, error: 'Must be greater than 0' };
    }
    
    if (num > 1000000) {
      return { isValid: false, error: 'Cannot exceed 1,000,000 tokens' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid number format' };
  }
}

export function formatWholeNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : Math.floor(value).toString();
}