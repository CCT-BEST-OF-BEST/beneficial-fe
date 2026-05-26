import { useEffect, useState } from 'react';
import { 
  getAdminSystemStatus, 
  postAdminInitializeAll, 
  postAdminSeedData, 
  postAdminRebuildVectorIndex, 
  postAdminRebuildBm25, 
  postAdminBuildHypotheticalQuestions,
  SystemStatusResponse
} from '@/features/admin/api/adminApi.ts';
import AuthStatusButton from '@/features/auth/ui/AuthStatusButton.tsx';
import { Database, Server, RefreshCw, Zap, Search, Settings } from 'lucide-react';
import { cn } from '@/shared/lib/utils.ts';

export default function AdminDashboard() {
  const [status, setStatus] = useState<SystemStatusResponse | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await getAdminSystemStatus();
      setStatus(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAction = async (actionName: string, actionFn: () => Promise<any>) => {
    if (!window.confirm(`${actionName} 작업을 실행하시겠습니까?`)) return;
    
    setLoadingAction(actionName);
    try {
      await actionFn();
      alert(`${actionName} 작업이 성공적으로 완료되었습니다.`);
      await fetchStatus();
    } catch (err) {
      console.error(err);
      alert(`${actionName} 작업 중 오류가 발생했습니다.`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex h-full flex-col p-8 bg-gray-50 min-h-screen font-sans">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="typography-SB3 text-gray-800 flex items-center gap-2">
          <Settings className="text-gray-500" />
          관리자 (Developer) 제어판
        </h1>
        <AuthStatusButton />
      </header>

      <div className="grid grid-cols-[1fr_300px] gap-8">
        <main className="flex flex-col gap-8">
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="typography-SB4 mb-4 text-gray-800 flex items-center gap-2">
              <Zap className="text-orange-500" />
              시스템 관리 명령어
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <AdminButton 
                title="Initialize All" 
                desc="시드 데이터 적재 및 전체 인덱싱 초기화 (최초 1회 권장)"
                isLoading={loadingAction === 'Initialize All'}
                onClick={() => handleAction('Initialize All', postAdminInitializeAll)}
              />
              <AdminButton 
                title="Seed Data" 
                desc="MongoDB에 초기 시드 데이터 적재"
                isLoading={loadingAction === 'Seed Data'}
                onClick={() => handleAction('Seed Data', postAdminSeedData)}
              />
              <AdminButton 
                title="Rebuild Vector Index" 
                desc="ChromaDB 벡터 인덱싱 전체 재구축"
                isLoading={loadingAction === 'Rebuild Vector Index'}
                onClick={() => handleAction('Rebuild Vector Index', postAdminRebuildVectorIndex)}
              />
              <AdminButton 
                title="Rebuild BM25" 
                desc="BM25 인메모리 인덱스만 빠른 재구축"
                isLoading={loadingAction === 'Rebuild BM25'}
                onClick={() => handleAction('Rebuild BM25', postAdminRebuildBm25)}
              />
              <AdminButton 
                title="Build Hypothetical Questions" 
                desc="OpenAI 연동 가상 질문 생성 (API 비용 발생 주의)"
                isLoading={loadingAction === 'Build Hypothetical Questions'}
                onClick={() => handleAction('Build Hypothetical Questions', postAdminBuildHypotheticalQuestions)}
                variant="warning"
              />
            </div>
          </section>
        </main>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="typography-SB4 text-gray-800 flex items-center gap-2">
                <Server className="text-sky-500" />
                시스템 상태
              </h2>
              <button onClick={fetchStatus} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>

            {status ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="typography-SB5 text-gray-600 mb-2 flex items-center gap-2">
                    <Database size={16} /> Chroma DB
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm font-mono text-green-600 mb-2">Status: {status.chroma_db?.status || 'Unknown'}</p>
                    <div className="text-xs text-gray-500 flex flex-col gap-1">
                      {status.chroma_db?.collections && Object.entries(status.chroma_db.collections).map(([name, count]) => (
                        <div key={name} className="flex justify-between">
                          <span>{name}</span>
                          <span className="font-bold text-gray-700">{count} docs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="typography-SB5 text-gray-600 mb-2 flex items-center gap-2">
                    <Search size={16} /> Redis Cache
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm font-mono text-green-600">Status: {status.redis?.status || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 typography-R5">
                상태 정보를 불러오는 중...
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function AdminButton({ title, desc, isLoading, onClick, variant = 'default' }: { title: string, desc: string, isLoading: boolean, onClick: () => void, variant?: 'default' | 'warning' }) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "flex flex-col text-left p-5 rounded-xl border transition-all",
        variant === 'warning' ? "border-red-200 bg-red-50 hover:bg-red-100" : "border-gray-200 bg-white hover:bg-gray-50",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex justify-between items-center w-full mb-2">
        <span className={cn("typography-SB5", variant === 'warning' ? "text-red-700" : "text-gray-800")}>{title}</span>
        {isLoading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
      </div>
      <span className={cn("typography-R6", variant === 'warning' ? "text-red-500" : "text-gray-500")}>{desc}</span>
    </button>
  );
}
