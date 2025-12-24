
import React, { useState } from 'react';
import { analyzeCompetitors } from './services/geminiService';
import { AnalysisReport, AnalysisStatus } from './types';
import { ProfessionalReport } from './components/ProfessionalReport';

const App: React.FC = () => {
  const [brands, setBrands] = useState<string[]>(['']);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddBrand = () => {
    if (brands.length < 5) setBrands([...brands, '']);
  };

  const handleRemoveBrand = (index: number) => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  const handleUpdateBrand = (index: number, value: string) => {
    const newBrands = [...brands];
    newBrands[index] = value;
    setBrands(newBrands);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activeBrands = brands.filter(b => b.trim().length > 0);
    if (activeBrands.length === 0) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeCompetitors(activeBrands);
      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '分析过程中发生意外错误。');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">智胜战略洞察 Pro</h1>
          </div>
          <div className="text-xs font-mono text-slate-400">CONSULTING EDITION MVP v2.0</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* Input Section */}
        {status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ANALYZING && (
          <div className="max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tighter">多维竞品深度对标</h2>
              <p className="text-slate-500 text-lg">基于麦肯锡咨询框架，输入 1-5 个品牌进行全方位的战略剖析。</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <div className="space-y-4 mb-8">
                {brands.map((brand, index) => (
                  <div key={index} className="flex gap-3 animate-in slide-in-from-left-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xs">0{index+1}</span>
                      <input 
                        type="text" 
                        value={brand}
                        onChange={(e) => handleUpdateBrand(index, e.target.value)}
                        placeholder="品牌名称（如：蔚来）"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    {brands.length > 1 && (
                      <button 
                        onClick={() => handleRemoveBrand(index)}
                        className="p-3 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleAddBrand}
                  disabled={brands.length >= 5}
                  className="flex-1 px-6 py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-xl hover:border-slate-400 hover:text-slate-600 transition-all disabled:opacity-30"
                >
                  + 添加对比品牌 ({brands.length}/5)
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={brands.every(b => !b.trim())}
                  className="px-12 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl transition-all disabled:bg-slate-300"
                >
                  生成专业咨询报告
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="py-32 text-center animate-pulse">
            <div className="inline-block w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold text-slate-900">正在构建战略对标矩阵...</h3>
            <p className="text-slate-500 mt-2">正在整合多维社交声量数据与市场专家洞察</p>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-md mx-auto p-8 bg-white border border-rose-100 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">生成失败</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
            >
              返回修改品牌
            </button>
          </div>
        )}

        {/* Report Content */}
        {status === AnalysisStatus.COMPLETED && report && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex justify-center mb-8 print:hidden">
              <button 
                onClick={() => setStatus(AnalysisStatus.IDLE)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                重新开始分析
              </button>
            </div>
            <ProfessionalReport report={report} />
          </div>
        )}
      </main>

      <footer className="mt-20 text-center opacity-30 text-[10px] uppercase tracking-widest print:hidden">
        CONSULTING DATA ENGINE • GEMINI STRATEGIC SUITE • © 2024
      </footer>
    </div>
  );
};

export default App;
