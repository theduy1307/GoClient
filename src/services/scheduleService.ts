import type { CreateScheduleCommand } from '@/types/apiModels';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const scheduleService = {
    async create(command: CreateScheduleCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Schedule', command);
        return response.data;
    }
};
