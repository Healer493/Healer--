
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AnalysisReport } from '../types';

interface Props {
  report: AnalysisReport;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalysisDashboard: React.FC<Props> = ({ report }) => {
  const radarData = [
    { subject: '市场份额', A: report.competitivePositioning.marketShare, fullMark: 100 },
    { subject: '品牌知名度', A: report.competitivePositioning.brandAwareness, fullMark: 100 },
    { subject: '消费者忠诚度', A: report.competitivePositioning.consumerLoyalty, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Summary */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">精</div>
          <h2 className="text-2xl font-bold text-slate-800">专家执行摘要</h2>
        </div>
        <p className="text-lg leading-relaxed text-slate-600 italic border-l-4 border-blue-100 pl-6 py-2">
          {report.executiveSummary}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Engagement */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">各平台品牌声量 (提及数)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.platformDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="platform" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [value, '声量指标']}
                />
                <Bar dataKey="mentionCount" name="声量" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Competitive Matrix */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">品牌实力维度分析</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Radar
                  name={report.brandName}
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Analysis */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-xl font-bold mb-6 text-slate-800">全渠道舆情分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.platformDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="sentimentScore"
                >
                  {report.platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '好感度']} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Strategic Recommendations */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 text-slate-800">专家战略行动建议</h3>
          <ul className="space-y-4">
            {report.strategicRecommendations.map((rec, i) => (
              <li key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <p className="text-slate-600 leading-snug">{rec}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Grounding Sources */}
      {report.sources && report.sources.length > 0 && (
        <section className="bg-slate-100 p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">实时数据依据与信息源</h3>
          <div className="flex flex-wrap gap-3">
            {report.sources.map((src, i) => (
              <a 
                key={i} 
                href={src.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-blue-600 hover:border-blue-300 transition-colors truncate max-w-[250px]"
              >
                🔗 {src.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisDashboard;
