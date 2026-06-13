import type { LoginCommand, MenuItem } from '@/types/apiModels';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const authService = {
    async login(command: LoginCommand): Promise<Result<string>> {
        const response = await apiClient.post<Result<string>>('/api/v1/Authentication/Login', command);
        return response.data;
    },

    async getMenu(employeeId: number): Promise<Result<MenuItem[]>> {
        const response = await apiClient.get<Result<MenuItem[]>>(`/api/v1/Authentication/Menu`, {
            params: { employeeId }
        });
        return response.data;
    }
};
