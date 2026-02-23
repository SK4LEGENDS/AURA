"use client";

import React, { useState } from "react";
import {
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie,
    ScatterChart, Scatter,
    Treemap,
    FunnelChart, Funnel, LabelList,
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    Cell, CartesianGrid, Legend
} from "recharts";
import {
    BarChart3,
    LineChart as LineIcon,
    PieChart as PieIcon,
    AreaChart as AreaIcon,
    Activity,
    Grid3X3,
    Filter,
    GanttChartSquare,
    Zap,
    RotateCcw,
    MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

// High-Fidelity Semantic Colors
// ... colors ...
const COLORS = {
    brand: "var(--brand-primary)",
    action: "var(--brand-secondary)",
    verified: "var(--status-high)",
    uncertain: "var(--status-medium)",
    risk: "var(--status-low)",
    text: "var(--text-secondary)",
    grid: "rgba(255,255,255,0.05)"
};

const initialMultiData = [
    { name: 'North', Laptops: 112000, Phones: 85000 },
    { name: 'South', Laptops: 98000, Phones: 105000 },
    { name: 'East', Laptops: 89000, Phones: 78000 },
    { name: 'West', Laptops: 132000, Phones: 125000 },
];

const initialPieData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Search', value: 300 },
    { name: 'Referral', value: 200 },
];

const initialTreemapData = [
    { name: 'Storage', size: 400 },
    { name: 'Compute', size: 300 },
    { name: 'Network', size: 200 },
    { name: 'Security', size: 260 },
    { name: 'Analytics', size: 150 },
    { name: 'Backup', size: 100 },
];

type ChartType = 'Bar' | 'Line' | 'Pie' | 'Area' | 'Scatter' | 'Radar' | 'Treemap' | 'Funnel' | 'Gantt';

export function VizPlayground() {
    const { t } = useI18n();
    const [chartType, setChartType] = useState<ChartType>('Bar');
    const [data, setData] = useState(initialMultiData);
    const [pieData, setPieData] = useState(initialPieData);
    const [treemapData, setTreemapData] = useState(initialTreemapData);

    const randomizeData = () => {
        setData(data.map(item => ({
            ...item,
            Laptops: Math.floor(Math.random() * 80000) + 50000,
            Phones: Math.floor(Math.random() * 80000) + 50000,
        })));
        setPieData(pieData.map(item => ({
            ...item,
            value: Math.floor(Math.random() * 400) + 100
        })));
        setTreemapData(treemapData.map(item => ({
            ...item,
            size: Math.floor(Math.random() * 400) + 50
        })));
    };

    const renderChart = () => {
        const commonProps = {
            width: "100%" as const,
            height: "100%" as const,
            margin: { top: 20, right: 30, left: 20, bottom: 5 }
        };

        const CustomGrid = () => <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />;

        switch (chartType) {
            case 'Bar':
                return (
                    <BarChart {...commonProps} data={data}>
                        <CustomGrid />
                        <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Legend iconType="circle" />
                        <Bar dataKey="Laptops" name={t("landing.viz.legendLaptops")} fill={COLORS.brand} radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="Phones" name={t("landing.viz.legendPhones")} fill={COLORS.verified} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                );
            case 'Line':
                return (
                    <LineChart {...commonProps} data={data}>
                        <CustomGrid />
                        <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Line type="monotone" dataKey="Laptops" name={t("landing.viz.legendLaptops")} stroke={COLORS.brand} strokeWidth={3} dot={{ fill: COLORS.brand, r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Phones" name={t("landing.viz.legendPhones")} stroke={COLORS.verified} strokeWidth={3} dot={{ fill: COLORS.verified, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );
            case 'Pie':
                return (
                    <PieChart {...commonProps}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.brand : COLORS.verified} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Legend />
                    </PieChart>
                );
            case 'Area':
                return (
                    <AreaChart {...commonProps} data={data}>
                        <CustomGrid />
                        <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="Laptops" name={t("landing.viz.legendLaptops")} stroke={COLORS.brand} fill={COLORS.brand} fillOpacity={0.1} />
                        <Area type="monotone" dataKey="Phones" name={t("landing.viz.legendPhones")} stroke={COLORS.verified} fill={COLORS.verified} fillOpacity={0.1} />
                    </AreaChart>
                );
            case 'Scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CustomGrid />
                        <XAxis type="number" dataKey="Laptops" name={t("landing.viz.legendLaptops")} unit="k" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis type="number" dataKey="Phones" name={t("landing.viz.legendPhones")} unit="k" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Scatter name={t("landing.viz.legendRevenue")} data={data} fill={COLORS.brand} />
                    </ScatterChart>
                );
            case 'Radar':
                return (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke={COLORS.grid} />
                        <PolarAngleAxis dataKey="name" stroke={COLORS.text} fontSize={10} />
                        <Radar name={t("landing.viz.legendLaptops")} dataKey="Laptops" stroke={COLORS.brand} fill={COLORS.brand} fillOpacity={0.5} />
                        <Radar name={t("landing.viz.legendPhones")} dataKey="Phones" stroke={COLORS.verified} fill={COLORS.verified} fillOpacity={0.3} />
                        <Legend />
                    </RadarChart>
                );
            case 'Treemap':
                return (
                    <Treemap
                        {...commonProps}
                        data={treemapData}
                        dataKey="size"
                        stroke="#000"
                        fill={COLORS.brand}
                    >
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                    </Treemap>
                );
            case 'Funnel':
                return (
                    <FunnelChart {...commonProps}>
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Funnel dataKey="Laptops" data={data} isAnimationActive>
                            <LabelList position="right" fill={COLORS.text} stroke="none" dataKey="name" />
                        </Funnel>
                    </FunnelChart>
                );
            case 'Gantt':
                return (
                    <BarChart {...commonProps} layout="vertical" data={data.map((d, i) => ({ ...d, start: i * 20 }))}>
                        <CustomGrid />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }} />
                        <Bar dataKey="start" fill="transparent" stackId="a" />
                        <Bar dataKey="Laptops" name={t("landing.viz.legendProcess")} fill={COLORS.verified} stackId="a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                );
        }
    };

    const chartButtons = [
        { id: 'Bar', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'Line', icon: <LineIcon className="w-4 h-4" /> },
        { id: 'Pie', icon: <PieIcon className="w-4 h-4" /> },
        { id: 'Area', icon: <AreaIcon className="w-4 h-4" /> },
        { id: 'Scatter', icon: <MousePointer2 className="w-4 h-4" /> },
        { id: 'Radar', icon: <Activity className="w-4 h-4" /> },
        { id: 'Treemap', icon: <Grid3X3 className="w-4 h-4" /> },
        { id: 'Funnel', icon: <Filter className="w-4 h-4" /> },
        { id: 'Gantt', icon: <GanttChartSquare className="w-4 h-4" /> },
    ];

    return (
        <section className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 w-full max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
                            <Zap className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">{t("landing.viz.badge")}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            {t("landing.viz.title")} <br />
                            <span className="text-zinc-500">{t("landing.viz.subtitle")}</span>
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            {t("landing.viz.desc")}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {chartButtons.map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => setChartType(btn.id as ChartType)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-medium text-xs",
                                        chartType === btn.id
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30"
                                    )}
                                >
                                    {btn.icon}
                                    {btn.id}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={randomizeData}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white hover:bg-zinc-800 transition-all font-bold text-sm shadow-xl"
                        >
                            <RotateCcw className="w-4 h-4" />
                            {t("landing.viz.randomize")}
                        </button>
                    </div>

                    <div className="flex-1 w-full max-w-3xl bg-zinc-900 shadow-2xl rounded-[32px] border border-white/10 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8 opacity-50">
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                                {t("landing.viz.mode").replace("{chartType}", chartType)}
                            </h3>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                <div className="w-2 h-2 rounded-full bg-status-high" />
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[300px] md:h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {renderChart()}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
