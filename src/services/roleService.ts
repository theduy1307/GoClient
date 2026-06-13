import type { RoleDto } from '@/types/apiModels';
import type { PagingResultBase } from '@/types/core/paging';
import type { Result } from '@/types/core/result';
import apiClient from './apiClient';

export const roleService = {
    async getPaging(pageIndex: number = 1, pageSize: number = 10): Promise<Result<PagingResultBase<RoleDto>>> {
        const response = await apiClient.get<Result<PagingResultBase<RoleDto>>>('/api/v1/Role', {
            params: { pageIndex, pageSize }
        });
        return response.data;
    }
};
