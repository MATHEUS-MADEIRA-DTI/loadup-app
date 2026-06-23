import { registerAs } from '@nestjs/config';

export interface ExercisesApiConfig {
  apiKey: string;
  baseUrl: string;
}

export const exercisesApiConfig = registerAs('exercisesApi', (): ExercisesApiConfig => {
  const apiKey = process.env.EXERCISES_API_KEY;
  if (!apiKey) {
    throw new Error('[ExercisesApi] EXERCISES_API_KEY is required but not set');
  }
  return {
    apiKey,
    baseUrl: 'https://api.api-ninjas.com/v1/exercises',
  };
});
