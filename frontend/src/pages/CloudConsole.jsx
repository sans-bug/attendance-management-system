import React, { useState, useEffect } from 'react';
import { 
  Cloud, Server, Database, ShieldCheck, Activity, Cpu, HardDrive, Network, Globe, AlertCircle, 
  Box, Archive, ShieldAlert, BarChart as BarChartIcon, Lock, Zap, MessageSquare, Eye, GitBranch, Search, Shield, Zap as StreamIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, AreaChart, Area 
} from 'recharts';
import api from '../services/api';

const AWS_SERVICES = [
  { id: 's3', name: 'Amazon S3', desc: 'Object storage for attendance records, images, and documents. Stores face recognition data and daily logs.', tags: ['Infinite scalability', 'Lifecycle policies', 'Cross-region replication'], icon: Box },
  { id: 'rds', name: 'Amazon RDS', desc: 'Managed relational database for structured attendance records, user profiles, and scheduling data.', tags: ['Multi-AZ', 'Read replicas', 'Auto backups'], icon: Database },
  { id: 'lambda', name: 'AWS Lambda', desc: 'Serverless functions triggered on attendance events — notifications, data processing, and integrations.', tags: ['Event-driven', 'Pay per use', '15 min timeout'], icon: Zap },
  { id: 'rekognition', name: 'Amazon Rekognition', desc: 'AI-powered face recognition for automatic check-in. Detects and verifies student identity in real time.', tags: ['Face search', 'Liveness detection', '99.9% accuracy'], icon: Eye },
  { id: 'cloudwatch', name: 'Amazon CloudWatch', desc: 'Monitor attendance patterns, system health, and set alarms for anomalies. Real-time dashboards and log insights.', tags: ['Custom metrics', 'Log Insights', 'Anomaly detection'], icon: Activity },
  { id: 'iam', name: 'AWS IAM', desc: 'Fine-grained access control. Teachers, admins, and students get role-based permissions with MFA enforcement.', tags: ['Policies', 'Roles', 'Federation', 'MFA'], icon: Lock },
  { id: 'cloudfront', name: 'Amazon CloudFront', desc: 'CDN for the attendance portal — fast load times worldwide. Edge caching for dashboards and static assets.', tags: ['Edge locations', 'HTTPS', 'Real-time logs'], icon: Globe },
  { id: 'sns', name: 'Amazon SNS', desc: 'Push notifications for attendance alerts — late arrivals, absences, and daily summaries to parents and admins.', tags: ['SMS', 'Email', 'Push', 'HTTP endpoints'], icon: MessageSquare },
  { id: 'athena', name: 'Amazon Athena', desc: 'Query attendance data directly from S3 using SQL. Ad-hoc analysis without provisioning infrastructure.', tags: ['Serverless', 'Presto engine', 'Pay per query'], icon: Search },
];

const CloudConsole = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKpi, setSelectedKpi] = useState('Total Students');

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/system/status');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Infrastructure Uplink Failed");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#e2c4a9', '#8c7e6d', '#bf9f7d', '#5c5449'];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-primary space-y-4">
      <Activity size={48} className="animate-spin" />
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase">Initializing Cloud Diagnostics...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-24 px-6">
       <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
       </div>
       <h2 className="text-xl font-bold text-white mb-2">Diagnostic Failure</h2>
       <p className="text-sm text-textMuted max-w-xs mx-auto mb-6">{error}</p>
       <button onClick={fetchSystemStatus} className="px-6 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-widest text-textMain hover:bg-border transition">Retry Uplink</button>
    </div>
  );

  const chartTheme = {
    tooltip: { contentStyle: { backgroundColor: '#1e1d1c', border: '1px solid #e2c4a9', borderRadius: '12px', fontSize: '10px' }, itemStyle: { color: '#e2c4a9', textTransform: 'uppercase' } },
    axis: { tick: { fill: '#8c7e6d', fontSize: 10 }, axisLine: { stroke: '#2d2b2a' }, grid: { stroke: '#2d2b2a', strokeDasharray: '3 3' } }
  };

  const summary = data.metrics.summary;
  const details = summary.details || {};
  const kpiKeyMap = {
    'Total Students': 'total_students',
    'Avg Attendance': 'avg_attendance',
    'Active Classes': 'active_classes',
    'Check-ins Today': 'checkins_today'
  };

  const selectedDetail = {
    label: selectedKpi,
    ...(details[kpiKeyMap[selectedKpi]] || {}),
    count: summary[kpiKeyMap[selectedKpi]]
  };

  const renderDetailItem = (item, key) => {
    if (key === 'total_students') {
      return (
        <div key={`${item.name}-${item.year}`} className="border-b border-border/20 py-3 last:border-b-0">
          <p className="text-sm text-white font-bold">{item.name}</p>
          <p className="text-[10px] text-textMuted uppercase tracking-[0.2em]">{item.department} • Year {item.year}</p>
        </div>
      );
    }

    if (key === 'avg_attendance') {
      return (
        <div key={item.student_name} className="border-b border-border/20 py-3 last:border-b-0">
          <p className="text-sm text-white font-bold">{item.student_name}</p>
          <p className="text-[10px] text-textMuted uppercase tracking-[0.2em]">{item.attended}/{item.total} sessions • {item.percentage}%</p>
        </div>
      );
    }

    if (key === 'active_classes') {
      return (
        <div key={item.subject} className="border-b border-border/20 py-3 last:border-b-0">
          <p className="text-sm text-white font-bold">{item.subject}</p>
          <p className="text-[10px] text-textMuted uppercase tracking-[0.2em]">{item.teacher} • {item.enrolled} enrolled</p>
        </div>
      );
    }

    if (key === 'checkins_today') {
      return (
        <div key={`${item.student_name}-${item.time}`} className="border-b border-border/20 py-3 last:border-b-0">
          <p className="text-sm text-white font-bold">{item.student_name}</p>
          <p className="text-[10px] text-textMuted uppercase tracking-[0.2em]">{item.subject} • {item.status} • {item.time}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="py-6 space-y-20 pb-20 animate-fade-in lg:px-6">
      
      {/* Infrastructure Top Bar */}
      <div className="flex justify-between items-center mb-4">
         <div>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Infastructure Console</p>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">Om Cloud <br/>Core</h1>
         </div>
         <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(226,196,169,0.1)]">
            <Cloud size={32} className="animate-pulse" />
         </div>
      </div>

      {/* Hero Section: Real-Time Analytics */}
      <section className="space-y-12">
         <div className="text-center space-y-4 mb-8">
            <h2 className="text-6xl font-black text-white tracking-tighter">Real-Time <span className="text-primary">Analytics</span></h2>
            <p className="text-textMuted text-sm max-w-2xl mx-auto leading-relaxed border-t border-border/20 pt-4">CloudWatch dashboards, QuickSight reports, and Athena queries — all visualized.</p>
         </div>

         {/* KPI Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
               { label: 'Total Students', value: summary.total_students, trend: summary.trends.students },
               { label: 'Avg Attendance', value: `${summary.avg_attendance}%`, trend: summary.trends.attendance },
               { label: 'Active Classes', value: summary.active_classes, trend: summary.trends.classes },
               { label: 'Check-ins Today', value: summary.checkins_today, trend: summary.trends.checkins },
            ].map((kpi, i) => (
               <button
                 key={i}
                 type="button"
                 onClick={() => setSelectedKpi(kpi.label)}
                 className={`card bg-[#141312] border-border/20 p-8 text-center space-y-4 group transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 ${selectedKpi === kpi.label ? 'border-primary/60 shadow-[0_0_30px_rgba(226,196,169,0.12)]' : 'hover:scale-105 active:scale-95'}`}
               >
                  <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold">{kpi.label}</p>
                  <p className="text-5xl font-bold text-white tracking-tighter">{kpi.value}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${kpi.trend === 'Live' ? 'text-primary' : 'text-primary/60'}`}>{kpi.trend}</p>
               </button>
            ))}
         </div>

         {/* KPI Detail Panel */}
         <div className="card bg-surface/50 border-border/20 p-8">
            <div className="flex items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-2">Selected Insight</p>
                 <h3 className="text-2xl font-bold text-white">{selectedDetail.title}</h3>
               </div>
               <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold">{selectedKpi}</span>
            </div>
            <p className="text-sm text-textMuted leading-relaxed mb-4">{selectedDetail.description}</p>
            <div className="rounded-3xl bg-[#141312] border border-border/30 p-6 mb-6">
               <p className="text-sm uppercase tracking-[0.2em] text-textMuted font-bold mb-2">Quick summary</p>
               <p className="text-lg font-bold text-white">{selectedDetail.detail}</p>
            </div>
            {selectedDetail.items?.length > 0 && (
              <div className="grid gap-4">
                {selectedDetail.items.map((item, idx) => renderDetailItem(item, kpiKeyMap[selectedKpi]))}
              </div>
            )}
         </div>

         {/* 2X2 ANALYTICS GRID: RESTORED */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Weekly Attendance */}
            <div className="card bg-surface/50 border-none shadow-none py-8 px-4">
               <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-8 px-4">Weekly Attendance</p>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data.metrics.weekly_attendance}>
                        <CartesianGrid vertical={false} {...chartTheme.axis.grid} />
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis domain={[0, 100]} {...chartTheme.axis} />
                        <Tooltip {...chartTheme.tooltip} cursor={{ fill: '#ffffff05' }} />
                        <Bar dataKey="value" fill="#e2c4a9" radius={[6, 6, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Monthly Trend */}
            <div className="card bg-surface/50 border-none shadow-none py-8 px-4">
               <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-8 px-4">Monthly Trend</p>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={data.metrics.monthly_trend}>
                        <CartesianGrid vertical={false} {...chartTheme.axis.grid} />
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis domain={[80, 100]} {...chartTheme.axis} />
                        <Tooltip {...chartTheme.tooltip} />
                        <Line type="monotone" dataKey="rate" stroke="#e2c4a9" strokeWidth={5} dot={{ fill: '#e2c4a9', r: 6 }} activeDot={{ r: 9, stroke: '#141312', strokeWidth: 2 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Real-Time Check-ins */}
            <div className="card bg-surface/50 border-none shadow-none py-8 px-4">
               <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-8 px-4">Real-Time Flux</p>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data.metrics.time_distribution}>
                        <defs>
                           <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#e2c4a9" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#e2c4a9" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} {...chartTheme.axis.grid} />
                        <XAxis dataKey="time" {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} />
                        <Tooltip {...chartTheme.tooltip} />
                        <Area type="monotone" dataKey="checkins" stroke="#e2c4a9" strokeWidth={3} fill="url(#fluxGrad)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* User Distribution */}
            <div className="card bg-surface/50 border-none shadow-none py-8 px-4">
               <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-8 px-4">User Ecosystem</p>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={data.metrics.user_distribution}
                           innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value" stroke="none"
                        >
                           {data.metrics.user_distribution.map((e, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip {...chartTheme.tooltip} />
                        <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-[10px] uppercase font-bold text-textMuted ml-1 tracking-widest">{v}</span>}/>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </section>

      {/* Simplified How Cloud Powers It */}
      <section className="space-y-12">
         <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter">Enterprise <span className="text-primary">Core</span></h2>
            <p className="text-textMuted text-sm max-w-2xl mx-auto leading-relaxed">A curated selection of the 9 foundational AWS services powering Om.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AWS_SERVICES.map((svc) => (
               <div key={svc.id} className="card bg-[#141312] border-border/20 p-8 flex flex-col h-full group hover:border-primary/50 transition-all">
                  <div className="flex items-start gap-4 mb-6">
                     <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <svc.icon size={28} />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-2">{svc.name}</h3>
                        <p className="text-xs text-textMuted leading-relaxed">{svc.desc}</p>
                     </div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                     {svc.tags.map((tag, i) => (
                        <span key={i} className="text-[8px] uppercase tracking-widest font-black text-primary/80 border border-primary/20 px-3 py-1.5 rounded-full bg-primary/5">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Architecture Footer */}
      <div className="card bg-[#141312] border-border/40 p-16 space-y-12">
         <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-4 opacity-70">Architecture Topology</p>
         </div>
         <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            <div className="flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-surface rounded-3xl border border-border flex items-center justify-center text-primary shadow-xl shadow-primary/5"><Globe size={36} /></div>
               <span className="text-xs font-black text-white uppercase tracking-widest">Global Edge</span>
            </div>
            <div className="hidden lg:block w-40 h-px bg-border/40 relative"><div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary/20 -translate-x-1/2 -translate-y-1/2 animate-ping"></div></div>
            <div className="flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-primary/10 rounded-3xl border border-primary/40 flex items-center justify-center text-primary shadow-2xl shadow-primary/20"><Cpu size={36} /></div>
               <span className="text-xs font-black text-white uppercase tracking-widest">Logic Hub</span>
            </div>
            <div className="hidden lg:block w-40 h-px bg-border/40"></div>
            <div className="flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-surface rounded-3xl border border-primary/30 flex items-center justify-center text-primary shadow-xl shadow-primary/5"><HardDrive size={36} /></div>
               <span className="text-xs font-black text-white uppercase tracking-widest">Vault Storage</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CloudConsole;
