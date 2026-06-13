import type { CreateBranchCommand } from '@/types/apiModels';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const branchService = {
    async createBranch(command: CreateBranchCommand): Promise<Result<number>> {
        const response = await apiClient.post<Result<number>>('/api/v1/Branch', command);
        return response.data;
    }
};
