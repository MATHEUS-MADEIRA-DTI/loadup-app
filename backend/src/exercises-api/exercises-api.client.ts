import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { exercisesApiConfig, ExercisesApiConfig } from './config/exercises-api.config';

export interface ApiNinjasExercise {
  name: string;
  muscle: string;
  type: string;
  equipment: string;
  instructions: string;
}

@Injectable()
export class ExercisesApiClient {
  constructor(
    private readonly httpService: HttpService,
    @Inject(exercisesApiConfig.KEY) private readonly config: ExercisesApiConfig,
  ) {}

  async search(name?: string, muscleEn?: string): Promise<ApiNinjasExercise[]> {
    const params: Record<string, string> = {};
    if (name !== undefined) params['name'] = name;
    if (muscleEn !== undefined) params['muscle'] = muscleEn;

    try {
      const response = await lastValueFrom(
        this.httpService.get<ApiNinjasExercise[]>(this.config.baseUrl, {
          headers: { 'X-Api-Key': this.config.apiKey },
          params,
        }),
      );
      return response.data;
    } catch {
      throw new Error('ExternalApiUnavailable');
    }
  }
}
