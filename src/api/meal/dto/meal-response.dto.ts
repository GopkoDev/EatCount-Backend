import { ApiProperty } from '@nestjs/swagger';
import { MealType } from '@prisma/client';

export class MealItemResponse {
  @ApiProperty({
    description: 'Meal item ID',
    example: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'Meal ID',
    example: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  mealId: string;

  @ApiProperty({
    description: 'Name of the food item',
    example: 'Banana',
  })
  name: string;

  @ApiProperty({
    description: 'Amount in grams',
    example: 100,
  })
  amountGrams: number;

  @ApiProperty({
    description: 'Calories per serving',
    example: 89,
  })
  calories: number;

  @ApiProperty({
    description: 'Protein in grams',
    example: 1.1,
  })
  protein: number;

  @ApiProperty({
    description: 'Fat in grams',
    example: 0.3,
  })
  fat: number;

  @ApiProperty({
    description: 'Carbohydrates in grams',
    example: 22.8,
  })
  carbs: number;

  @ApiProperty({
    description: 'Saturated fat in grams',
    example: 0.1,
  })
  saturatedFat: number;

  @ApiProperty({
    description: 'Polyunsaturated fat in grams',
    example: 0.1,
  })
  polyunsaturatedFat: number;

  @ApiProperty({
    description: 'Monounsaturated fat in grams',
    example: 0.1,
  })
  monounsaturatedFat: number;

  @ApiProperty({
    description: 'Cholesterol in mg',
    example: 0,
  })
  cholesterol: number;

  @ApiProperty({
    description: 'Sodium in mg',
    example: 1,
  })
  sodium: number;

  @ApiProperty({
    description: 'Potassium in mg',
    example: 358,
  })
  potassium: number;

  @ApiProperty({
    description: 'Fiber in grams',
    example: 2.6,
  })
  fiber: number;

  @ApiProperty({
    description: 'Sugar in grams',
    example: 12.2,
  })
  sugar: number;

  @ApiProperty({
    description: 'Vitamin A in IU',
    example: 64,
  })
  vitaminA: number;

  @ApiProperty({
    description: 'Vitamin C in mg',
    example: 8.7,
  })
  vitaminC: number;

  @ApiProperty({
    description: 'Calcium in mg',
    example: 5,
  })
  calcium: number;

  @ApiProperty({
    description: 'Iron in mg',
    example: 0.3,
  })
  iron: number;

  @ApiProperty({
    description: 'Trans fat in grams',
    example: 0,
    required: false,
  })
  transFat?: number | null;

  @ApiProperty({
    description: 'Added sugars in grams',
    example: 0,
    required: false,
  })
  addedSugars?: number | null;

  @ApiProperty({
    description: 'Vitamin D in IU',
    example: 0,
    required: false,
  })
  vitaminD?: number | null;
}

export class MealResponse {
  @ApiProperty({
    description: 'Meal ID',
    example: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  userId: string;

  @ApiProperty({
    description: 'Meal type',
    enum: MealType,
    example: MealType.BREAKFAST,
  })
  type: MealType;

  @ApiProperty({
    description: 'Meal timestamp',
    example: '2025-01-15T08:00:00.000Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Meal description',
    example: 'Healthy breakfast',
  })
  description: string;

  @ApiProperty({
    description: 'Total calories for the meal',
    example: 450,
  })
  totalCalories: number;

  @ApiProperty({
    description: 'Total protein in grams',
    example: 25.5,
  })
  totalProtein: number;

  @ApiProperty({
    description: 'Total fat in grams',
    example: 12.3,
  })
  totalFat: number;

  @ApiProperty({
    description: 'Total carbohydrates in grams',
    example: 60.8,
  })
  totalCarbs: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T08:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T08:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Meal items',
    type: [MealItemResponse],
  })
  items: MealItemResponse[];
}
