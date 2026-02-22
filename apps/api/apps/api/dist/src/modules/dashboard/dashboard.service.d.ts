import type { DashboardSummary } from '../../types';
export declare class DashboardService {
    getSummary(companyId: string): Promise<DashboardSummary>;
    emitDashboardUpdate(companyId: string): Promise<void>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map