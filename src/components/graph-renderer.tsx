"use client";

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap,
    FunnelChart, Funnel
} from 'recharts';
import { Download, Maximize2, X, ChevronDown, FileJson, FileType, Image as ImageIcon } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';

export type GraphData = {
    type?: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar' | 'treemap' | 'funnel' | 'gantt';
    title?: string;
    xAxisKey?: string;
    data: any[];
    series?: {
        dataKey: string;
        name?: string;
        color?: string;
    }[];
};

type GraphRendererProps = {
    graph: GraphData;
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const CHART_TYPES = ['bar', 'line', 'pie', 'area', 'scatter', 'radar', 'treemap', 'funnel', 'gantt'] as const;

export function GraphRenderer({ graph }: GraphRendererProps) {
    const { accentColor } = useSettings();
    const chartRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentType, setCurrentType] = useState<GraphData['type']>(graph.type || 'bar');
    const [showTypeSelector, setShowTypeSelector] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sanitize and auto-configure graph data
    const processedGraph = React.useMemo(() => {
        if (!graph.data) return null;

        // Ensure data is an array
        let rawData = Array.isArray(graph.data) ? graph.data : [];
        if (!Array.isArray(graph.data) && typeof graph.data === 'object' && graph.data !== null) {
            // Convert { "Apples": 10, "Oranges": 20 } to [{ category: "Apples", value: 10 }, ...]
            rawData = Object.entries(graph.data).map(([key, val]) => ({
                category: key,
                value: typeof val === 'number' ? val : (typeof val === 'string' ? parseFloat(val) : 0)
            }));
        }

        if (rawData.length === 0) return null;

        const cleanData = rawData.map(item => {
            const newItem: any = { ...item };
            Object.keys(newItem).forEach(key => {
                const val = newItem[key];

                // --- ULTRA-RECOVERY NUMERICAL LOGIC ---
                if (typeof val === 'string' && val.trim() !== '') {
                    // 1. Remove commas and currency/unit symbols ($, €, %, k, m)
                    let numPart = val.replace(/[$,€%km]/gi, '').replace(/,/g, '').trim();

                    // 2. If it's still not a number, maybe it's a list "8, 7, 9"
                    // We'll try to extract the FIRST number found
                    if (isNaN(Number(numPart))) {
                        const firstNumMatch = val.match(/-?\d+(\.\d+)?/);
                        if (firstNumMatch) {
                            numPart = firstNumMatch[0];
                        }
                    }

                    const finalNum = Number(numPart);
                    if (!isNaN(finalNum)) {
                        newItem[key] = finalNum;
                    }
                }
            });
            return newItem;
        });

        let xAxisKey = graph.xAxisKey;
        let series = graph.series || [];

        if (!xAxisKey || series.length === 0) {
            const firstItem = cleanData[0];
            const keys = Object.keys(firstItem);
            const potentialXKeys = ['month', 'date', 'year', 'day', 'time', 'category', 'name', 'label'];
            xAxisKey = keys.find(k => potentialXKeys.includes(k.toLowerCase()));
            if (!xAxisKey) xAxisKey = keys.find(k => typeof firstItem[k] === 'string');
            if (!xAxisKey) xAxisKey = keys[0];

            if (series.length === 0) {
                const allKeys = new Set<string>();
                cleanData.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
                const numericKeys = Array.from(allKeys).filter(k => {
                    if (k === xAxisKey) return false;
                    return cleanData.some(item => typeof item[k] === 'number');
                });
                series = numericKeys.map((k, i) => ({
                    dataKey: k,
                    name: k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'),
                    color: COLORS[i % COLORS.length]
                }));
            }
        }

        return {
            type: currentType,
            title: graph.title || 'Graph',
            xAxisKey,
            data: cleanData,
            series
        };
    }, [graph, currentType]);

    if (!processedGraph || processedGraph.series.length === 0) {
        return (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                Unable to visualize data. Please try again.
            </div>
        );
    }

    const handleDownload = (format: 'png' | 'svg' | 'pdf') => {
        if (!chartRef.current) return;
        const originalSvg = chartRef.current.querySelector('svg');
        if (!originalSvg) return;

        const clonedSvg = originalSvg.cloneNode(true) as SVGElement;
        const svgSize = originalSvg.getBoundingClientRect();
        clonedSvg.setAttribute('width', `${svgSize.width}`);
        clonedSvg.setAttribute('height', `${svgSize.height}`);
        clonedSvg.style.backgroundColor = '#ffffff';

        const svgData = new XMLSerializer().serializeToString(clonedSvg);

        if (format === 'svg') {
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${processedGraph.title || 'chart'}.svg`;
            link.click();
            URL.revokeObjectURL(url);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        canvas.width = svgSize.width * 2;
        canvas.height = svgSize.height * 2;

        img.onload = () => {
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(2, 2);
                ctx.drawImage(img, 0, 0);

                if (format === 'png') {
                    const pngUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `${processedGraph.title || 'chart'}.png`;
                    link.click();
                } else if (format === 'pdf') {
                    const pdf = new jsPDF({
                        orientation: svgSize.width > svgSize.height ? 'landscape' : 'portrait',
                        unit: 'px',
                        format: [svgSize.width, svgSize.height]
                    });
                    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, svgSize.width, svgSize.height);
                    pdf.save(`${processedGraph.title || 'chart'}.pdf`);
                }
            }
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const renderChart = (expandedView = false) => {
        switch (processedGraph.type) {
            case 'bar':
                return (
                    <BarChart data={processedGraph.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={processedGraph.xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} fill={s.color || COLORS[i % COLORS.length]} maxBarSize={expandedView ? 100 : 60} />
                        ))}
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={processedGraph.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={processedGraph.xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Line key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name} stroke={s.color || COLORS[i % COLORS.length]} />
                        ))}
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={processedGraph.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={processedGraph.xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Area key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name} fill={s.color || COLORS[i % COLORS.length]} stroke={s.color || COLORS[i % COLORS.length]} />
                        ))}
                    </AreaChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Pie key={s.dataKey} data={processedGraph.data} dataKey={s.dataKey} nameKey={processedGraph.xAxisKey} cx="50%" cy="50%" outerRadius={expandedView ? "75%" : 80} fill={s.color || COLORS[i % COLORS.length]} label>
                                {processedGraph.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        ))}
                    </PieChart>
                );
            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid />
                        <XAxis type="number" dataKey={processedGraph.xAxisKey} name={processedGraph.xAxisKey} />
                        <YAxis type="number" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Scatter key={s.dataKey} name={s.name} data={processedGraph.data} fill={s.color || COLORS[i % COLORS.length]} />
                        ))}
                    </ScatterChart>
                );
            case 'radar':
                return (
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedGraph.data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey={processedGraph.xAxisKey} />
                        <PolarRadiusAxis />
                        <Tooltip />
                        <Legend />
                        {processedGraph.series.map((s, i) => (
                            <Radar key={s.dataKey} name={s.name} dataKey={s.dataKey} stroke={s.color || COLORS[i % COLORS.length]} fill={s.color || COLORS[i % COLORS.length]} fillOpacity={0.6} />
                        ))}
                    </RadarChart>
                );
            case 'treemap':
                return (
                    <Treemap data={processedGraph.data} dataKey={processedGraph.series[0]?.dataKey || 'value'} aspectRatio={4 / 3} stroke="#fff" fill={accentColor}>
                        <Tooltip />
                    </Treemap>
                );
            case 'funnel':
                return (
                    <FunnelChart>
                        <Tooltip />
                        <Legend />
                        <Funnel
                            data={processedGraph.data.map((d, i) => ({
                                ...d,
                                fill: COLORS[i % COLORS.length]
                            }))}
                            dataKey={processedGraph.series[0]?.dataKey || 'value'}
                            nameKey={processedGraph.xAxisKey}
                            label
                        />
                    </FunnelChart>
                );
            case 'gantt':
                // Simple Gantt using horizontal bar chart
                return (
                    <BarChart data={processedGraph.data} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey={processedGraph.xAxisKey} type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="start" stackId="a" fill="transparent" />
                        <Bar dataKey="duration" stackId="a" fill={accentColor} name="Duration" />
                    </BarChart>
                );
            default:
                return <div>Unsupported chart type</div>;
        }
    };

    const dataCount = processedGraph.data.length;
    const minScrollWidth = dataCount > 10 ? `${Math.max(600, dataCount * 100)}px` : '100%';

    const chartHeader = (isExpanded: boolean) => (
        <div className="mb-4 flex items-center justify-between flex-shrink-0">
            <h3 className={cn("font-bold", isExpanded ? "text-xl text-white" : "text-gray-900 dark:text-white")}>
                {processedGraph.title || 'Chart Analysis'}
            </h3>
            <div className="flex items-center gap-2">
                {/* Type Selector (Graph Editor) */}
                <div className="relative">
                    <button
                        onClick={() => setShowTypeSelector(!showTypeSelector)}
                        className="flex items-center gap-1 rounded-lg bg-black/5 px-3 py-1.5 text-sm font-medium hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                        <span className="capitalize">{currentType}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    {showTypeSelector && (
                        <div className="absolute right-0 top-full z-[110] mt-1 w-40 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                            {CHART_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setCurrentType(type);
                                        setShowTypeSelector(false);
                                    }}
                                    className={cn(
                                        "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                                        currentType === type ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    <span className="capitalize">{type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/5"
                        title="Expand"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                )}

                {/* Export Dropdown */}
                <div className="group relative">
                    <button className="rounded-lg p-2 text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/5">
                        <Download className="h-4 w-4" />
                    </button>
                    <div className="invisible absolute right-0 top-full z-[110] pt-1 group-hover:visible">
                        <div className="w-32 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                            <button onClick={() => handleDownload('png')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                                <ImageIcon className="h-4 w-4" /> PNG
                            </button>
                            <button onClick={() => handleDownload('svg')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                                <FileJson className="h-4 w-4" /> SVG
                            </button>
                            <button onClick={() => handleDownload('pdf')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                                <FileType className="h-4 w-4" /> PDF
                            </button>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="ml-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-10 animate-in fade-in duration-200">
            <div className="relative w-full max-w-7xl h-[85vh] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl flex flex-col">
                {chartHeader(true)}
                <div className="w-full flex-grow overflow-x-auto overflow-y-hidden rounded-xl bg-black/20 p-4">
                    <div style={{ width: minScrollWidth, minWidth: '100%' }} className="h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart(true)}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {chartHeader(false)}
                <div className="w-full overflow-x-auto pb-2">
                    <div style={{ width: minScrollWidth, minWidth: '100%' }} className="h-[300px]" ref={chartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart(false)}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            {isExpanded && mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
        </>
    );
}

