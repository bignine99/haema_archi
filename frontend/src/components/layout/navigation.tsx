import React from 'react';
import {
    MapPin, Scale, Compass, Network, Grid, Box, PieChart,
    Lightbulb, ShieldCheck, Layers, FileText, Target, 
    Milestone, Wrench, Settings, Leaf, Zap
} from 'lucide-react';

export const MENU_GROUPS = [
    {
        title: 'Phase A. 기획 및 분석',
        items: [
            { id: 'task_analysis', label: '과업지시서 분석', icon: <FileText size={18} /> },
            { id: 'site', label: '대지현황 분석', icon: <MapPin size={18} /> },
            { id: 'regulation', label: '법규/조례 검토', icon: <Scale size={18} /> },
            { id: 'project_characteristics', label: '프로젝트 특성 분석', icon: <PieChart size={18} /> },
            { id: 'concept_generator', label: '디자인 컨셉 제네레이터', icon: <Lightbulb size={18} /> },
        ]
    },
    {
        title: 'Phase B. 공간 프로그래밍',
        items: [
            { id: 'space_zoning', label: '층별 조닝 & 스페이스', icon: <Layers size={18} /> },
            { id: 'bubble_b', label: '버블다이어그램', icon: <Network size={18} /> },
            { id: 'spatial_strategy', label: '맞춤형 공간 특화 전략', icon: <Target size={18} /> },
            { id: 'circulation_layout', label: '동선 및 프로그램 배치', icon: <Milestone size={18} /> },
        ]
    },
    {
        title: 'Phase C. 전문엔지니어링 분석',
        items: [
            { id: 'special_design', label: '특화설계 제안', icon: <Wrench size={18} /> },
            { id: 'structural_engineering', label: '구조 및 엔지니어링', icon: <Settings size={18} /> },
            { id: 'eco_strategy', label: '친환경 특화 전략', icon: <Leaf size={18} /> },
            { id: 'energy_strategy', label: '에너지 특화전략', icon: <Zap size={18} /> },
            { id: 'bf_strategy', label: 'BF 특화전략', icon: <ShieldCheck size={18} /> },
        ]
    },
    {
        title: 'Phase D. 시각화 및 제안',
        items: [
            { id: '3dmass', label: '3D 매스', icon: <Box size={18} /> },
            { id: 'siteplan', label: '배치도', icon: <Compass size={18} /> },
            { id: 'floorplan', label: '평면/입면/단면도', icon: <Grid size={18} /> },
            { id: 'concept_diagram', label: '개념도 및 시각화', icon: <Lightbulb size={18} /> },
        ]
    }
];

export const allMenuItems = MENU_GROUPS.flatMap(g => g.items);
