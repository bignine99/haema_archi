export interface PhaseCPayload {
    siteId: string;
    buildLinePolygon: [number, number][];
    floors: Array<{
        level: number;
        targetArea: number;
        height: number;
        primaryUsages: string[];
    }>;
    constraints: {
        maxCoverage: number;
        maxFAR: number;
    };
}

class MSASyncService {
    private endpoint = 'http://localhost:8003/api/sync-mass';

    async syncScaleData(payload: PhaseCPayload) {
        console.log('[Phase B -> Phase C] Syncing to Phase C Mass Engine:', payload);
        
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                console.warn('Phase C server not responding with 200 OK. Is port 8003 running?');
                throw new Error(`Sync failed with status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('MSA Sync Error:', error);
            // 클라이언트에 직관적인 에러 메시지 제공
            throw new Error('Phase C(8003 포트) 연동에 실패했습니다. 3D 엔진 서비스가 실행 중인지 확인하세요.');
        }
    }
}

export const msaSyncService = new MSASyncService();
