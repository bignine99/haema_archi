import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { KakaoAddressResult } from '@/services/gisApi';
import { allMenuItems } from './navigation';

// ─── 3D 매스 헤더 주소검색 컴포넌트 ───
export function MassAddressSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<KakaoAddressResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const searchRealAddress = useProjectStore(s => s.searchRealAddress);
    const loadRealParcel = useProjectStore(s => s.loadRealParcel);
    const address = useProjectStore(s => s.address);
    const isLoading = useProjectStore(s => s.isLoading);
    const apiError = useProjectStore(s => s.apiError);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setSearching(true);
        setSearchError(null);
        try {
            const res = await searchRealAddress(query);
            setResults(res);
            if (res && res.length > 0) {
                // 첫 번째 검색 결과를 자동으로 선택
                setQuery(res[0].address_name);
                await loadRealParcel(res[0]);
                setShowDropdown(false);
            } else {
                setSearchError('검색 결과가 없는 주소입니다.');
                setShowDropdown(false);
            }
        } catch (error) {
            console.error(error);
            setSearchError('검색 중 오류가 발생했습니다.');
        } finally {
            setSearching(false);
        }
    };

    const handleSelect = async (result: KakaoAddressResult) => {
        setShowDropdown(false);
        setQuery(result.address_name);
        await loadRealParcel(result);
    };

    return (
        <div className="relative flex items-center gap-2">
            <input
                type="text"
                placeholder={address || "주소 검색 (예: 김해시 삼계동)"}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-800 w-64 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
            <button
                onClick={handleSearch}
                disabled={searching || isLoading}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-600 text-white font-bold text-[13px] hover:bg-orange-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
                <Search size={14} />
                {searching ? '검색중...' : '검색'}
            </button>
            {isLoading && (
                <span className="text-xs text-orange-500 animate-pulse">대지 로딩중...</span>
            )}
            {apiError && (
                <span className="text-xs text-red-500 font-medium pl-1">{apiError}</span>
            )}
            {searchError && (
                <span className="text-xs text-red-500 font-medium pl-1">{searchError}</span>
            )}

            {/* 카카오 검색 결과 드롭다운 */}
            {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    <div className="px-3 py-1.5 bg-slate-50 border-b">
                        <span className="text-[10px] text-orange-600 font-semibold">카카오 검색 결과 ({results.length}건)</span>
                    </div>
                    {results.map((r, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(r)}
                            className="w-full px-3 py-2 text-left hover:bg-orange-50 border-b border-slate-100 last:border-b-0"
                        >
                            <div className="text-sm text-slate-800">{r.address_name}</div>
                            {r.road_address && (
                                <div className="text-[10px] text-slate-500">{r.road_address.address_name}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface HeaderProps {
    activeMenu: string;
}

export default function Header({ activeMenu }: HeaderProps) {
    const store = useProjectStore();
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [tempKey, setTempKey] = useState(store.geminiApiKey || '');

    const handleSaveKey = () => {
        store.setGeminiApiKey(tempKey);
        setShowKeyInput(false);
    };

    return (
        <header className="border-b border-slate-200 shrink-0 flex items-center justify-between px-6 bg-white z-20" style={{ height: '60px' }}>
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                    {allMenuItems.find(m => m.id === activeMenu)?.icon}
                </div>
                <h2 className="font-bold text-slate-800" style={{ fontSize: '18px' }}>
                    {allMenuItems.find(m => m.id === activeMenu)?.label} 모듈
                </h2>
            </div>
            <div className="flex items-center gap-4">
                {/* Phase D 전용 주소 검색 — 시각화/제안 모듈에서만 표시 */}
                {['3dmass', 'siteplan', 'floorplan', 'concept_diagram'].includes(activeMenu) && (
                    <MassAddressSearch />
                )}
                
                <div className="relative">
                    {store.geminiApiKey && store.geminiApiKey !== 'demo_mode_no_key' ? (
                        <button 
                            onClick={() => { setTempKey(store.geminiApiKey); setShowKeyInput(!showKeyInput); }}
                            className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5 shadow-sm hover:bg-emerald-100 transition-colors" 
                            title="클릭하여 API 키 변경"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            API 연동 완료 (AI 모드)
                        </button>
                    ) : store.geminiApiKey === 'demo_mode_no_key' ? (
                        <button 
                            onClick={() => { setTempKey(''); setShowKeyInput(!showKeyInput); }}
                            className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200 flex items-center gap-1.5 shadow-sm hover:bg-amber-100 transition-colors animate-pulse" 
                            title="클릭하여 API 키 등록 (현재 규칙 기반 작동 중)"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            데모 모드 (API 키 미등록)
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setTempKey(''); setShowKeyInput(!showKeyInput); }}
                            className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-semibold border border-red-200 flex items-center gap-1.5 shadow-sm hover:bg-red-100 transition-colors" 
                            title="클릭하여 API 키 입력"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            API 미연동 (키 입력 필요)
                        </button>
                    )}
                    {showKeyInput && (
                        <div className="absolute right-0 mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-72 flex flex-col gap-2">
                            <span className="text-xs font-semibold text-slate-700">Gemini API Key 설정</span>
                            <input
                                type="password"
                                placeholder="AIzaSy..."
                                value={tempKey}
                                onChange={e => setTempKey(e.target.value)}
                                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 w-full outline-none focus:ring-1 focus:ring-orange-400"
                            />
                            <div className="flex justify-end gap-1.5">
                                <button
                                    onClick={() => setShowKeyInput(false)}
                                    className="px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveKey}
                                    className="px-2 py-1 text-[11px] bg-orange-600 text-white font-bold rounded hover:bg-orange-700"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button className="text-[12px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                    <span>프로젝트 내보내기</span>
                </button>
            </div>
        </header>
    );
}
