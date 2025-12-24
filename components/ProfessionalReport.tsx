
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { AnalysisReport } from '../types';

const COLORS = ['#1e40af', '#047857', '#b91c1c', '#7e22ce', '#c2410c'];

export const ProfessionalReport: React.FC<{ report: AnalysisReport }> = ({ report }) => {
  const handlePrint = () => {
    window.print();
  };

  // 安全检查：如果 report 核心对象缺失
  if (!report) return <div className="p-12 text-center text-slate-500">报告数据载入异常</div>;

  return (
    <div id="report-content" className="max-w-5xl mx-auto bg-white shadow-2xl my-8 print:my-0 print:shadow-none font-serif text-slate-900 overflow-hidden rounded-xl print:rounded-none border border-slate-200">
      {/* Cover Header */}
      <div className="bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <span className="text-sm font-mono tracking-widest opacity-60">STRATEGIC INTELLIGENCE / CONFIDENTIAL</span>
            <button 
              onClick={handlePrint}
              className="print:hidden px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm transition-all"
            >
              导出为 PDF
            </button>
          </div>
          <h1 className="text-5xl font-bold mb-4">竞品战略对标分析报告</h1>
          <p className="text-xl opacity-80 max-w-2xl font-light">
            基于全渠道社交数据与市场竞争格局的深度洞察
          </p>
          <div className="mt-8 pt-8 border-t border-white/10 text-sm flex gap-8">
            <div><span className="opacity-50">分析日期：</span>{new Date().toLocaleDateString('zh-CN')}</div>
            <div><span className="opacity-50">模型版本：</span>Gemini 3 Pro + Search Grounding</div>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <div className="p-12 border-b border-slate-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-8 h-1 bg-slate-900"></span> 01. 执行摘要
        </h2>
        <div className="bg-slate-50 p-8 rounded-lg italic text-lg leading-relaxed text-slate-700 border-l-4 border-slate-400">
          {report.executiveSummary || "暂无执行摘要数据"}
        </div>
      </div>

      {/* 2. Industry Landscape */}
      <div className="p-12 border-b border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-slate-900"></span> 02. 行业与市场格局
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">市场规模与定位</h3>
            <p className="text-lg mb-4">{report.marketLandscape?.marketSize || "数据收集中..."}</p>
            <p className="text-slate-600 leading-relaxed">{report.marketLandscape?.competitiveLandscape}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">核心趋势洞察</h3>
            <ul className="space-y-3">
              {(report.marketLandscape?.trends || []).map((t, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Competitor Deep Dive */}
      <div className="p-12 bg-slate-50/50 border-b border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-slate-900"></span> 03. 竞品深度画像
        </h2>
        <div className="space-y-12">
          {(report.competitors || []).map((comp, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                <div className="max-w-md">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold mb-2 uppercase tracking-tighter">
                    {comp.name}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{comp.positioning}</h3>
                  <p className="text-slate-500">目标客群：{comp.targetAudience}</p>
                </div>
                <div className="flex-1 max-w-xs h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comp.metrics || []}>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#eee" />
                      <XAxis dataKey="platform" tick={{fontSize: 10}} hide />
                      <Tooltip />
                      <Bar dataKey="mentionCount" fill={COLORS[idx % COLORS.length]} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">战略优势 (Strengths)</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {(comp.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest">潜在弱点 (Weaknesses)</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {(comp.weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Strategic Comparison Radar */}
      <div className="p-12 border-b border-slate-100">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-slate-900"></span> 04. 战略对标矩阵
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={(report.strategicComparison || []).map(d => {
                const item: any = { subject: d.dimension };
                (d.values || []).forEach(v => { item[v.brand] = v.score; });
                return item;
              })}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 600}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {(report.competitors || []).map((c, i) => (
                  <Radar key={c.name} name={c.name} dataKey={c.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.2} />
                ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">营销洞察总结</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {report.marketingInsights || "暂无进一步洞察总结"}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Action Plan */}
      <div className="p-12 bg-slate-900 text-white">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-1 bg-white"></span> 05. 战略建议与行动方案
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(report.actionPlan || []).map((plan, i) => (
            <div key={i} className="border border-white/10 p-6 rounded-lg bg-white/5">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-2">{plan.phase}</span>
              <ul className="space-y-4">
                {(plan.steps || []).map((step, j) => (
                  <li key={j} className="text-sm opacity-80 flex gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Sources */}
      <div className="p-12 bg-white text-xs text-slate-400 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-md">
          <h4 className="font-bold text-slate-600 mb-2 uppercase tracking-widest">免责声明</h4>
          <p>本报告基于 AI 生成及公开互联网数据，仅供战略参考。在做出重大投资或经营决策前，请咨询相关行业专家或通过多方渠道进行核实。</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-slate-600 mb-2 uppercase tracking-widest">数据来源</h4>
          {(report.sources || []).slice(0, 5).map((s, i) => (
            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="hover:text-blue-500 truncate max-w-xs">{s.title}</a>
          ))}
        </div>
      </div>
    </div>
  );
};
