import type { WeatherForecast } from '@/types/apiModels';
import apiClient from './apiClient';

export const weatherForecastService = {
    async getWeatherForecast(): Promise<WeatherForecast[]> {
        const response = await apiClient.get<WeatherForecast[]>('/WeatherForecast');
        return response.data;
    }
};
