import React, { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { 
    ArrowRight, ArrowLeft,
    LayoutDashboard, Scale, MapPin, Compass, Network, Grid, Building, Ruler, Box, Lightbulb, ImageIcon, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface LandingPageProps {
    onEnter: () => void;
}

const features = [
    { id: 'dashboard', title: '과업지시서 분석', status: '완료', icon: LayoutDashboard, desc: '제공된 과업지시서(PDF/문서)를 AI가 분석하여 핵심 건축 요구사항 및 개요를 추출합니다.' },
    { id: 'regulation', title: '법규분석', status: '완료', icon: Scale, desc: '대지 위치를 기반으로 정북일조, 대지안의 공지 등 건축법규를 검토합니다.' },
    { id: 'site', title: '대지분석', status: '완료', icon: MapPin, desc: 'VWorld 3D 지형 데이터를 연동하여 고도, 경사, 주변 건축물을 파악합니다.' },
    { id: '3dmass', title: '3D 매스', status: '완료', icon: Box, desc: '법적 규제선을 준수하며 사용자 의도에 따라 다양한 형태의 매스를 생성합니다.' },
    { id: 'siteplan', title: '배치도', status: '예정', icon: Compass, desc: '차량 동선, 주차 및 조경 면적을 종합 고려하여 대지 내 배치를 제안합니다.' },
    { id: 'bubble', title: '버블다이어그램', status: '예정', icon: Network, desc: '스페이스 프로그램 간의 동선 체계와 연계성을 시각화합니다.' },
    { id: 'floorplan', title: '평면도', status: '예정', icon: Grid, desc: '공간 요구사항을 토대로 각 층별 최적화된 레이아웃을 분할합니다.' },
    { id: 'elevation', title: '입면도', status: '예정', icon: Building, desc: '재질과 창호 분할 비율 등을 고려하여 입면 디자인을 즉각적으로 생성합니다.' },
    { id: 'section', title: '단면도', status: '예정', icon: Ruler, desc: '수직적 구조를 기반으로 층고와 코어 구성 체계를 작성합니다.' },
    { id: 'engineering', title: '특화 엔지니어링', status: '완료', icon: Lightbulb, desc: '구조, 토목, 기계 등 9대 분야의 동적 AI 엔지니어링 데이터를 실시간 시각화합니다.' },
    { id: 'concept_image', title: '컨셉이미지', status: '예정', icon: ImageIcon, desc: '레퍼런스를 참조하여 다양한 스타일의 매력적인 투시도를 생성합니다.' },
    { id: 'rendering', title: '렌더링 생성', status: '예정', icon: Camera, desc: '고품질 엔진과 연동하여 최종 프레젠테이션용 리얼리스틱 뷰를 도출합니다.' },
];

/* ─────────────────────────────────────────────────────────
    Global Styles (for Typography & Minimalism)
────────────────────────────────────────────────────────── */
const EditorialStyle = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-serif-elegant { font-family: 'Playfair Display', serif; }
        
        .feature-block { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-minimal { 
            background: transparent; 
            border: none; 
            border-bottom: 1px solid rgba(255,255,255,0.3); 
            border-radius: 0;
            color: white;
            transition: border-color 0.3s;
        }
        .input-minimal:focus {
            outline: none;
            border-color: white;
            box-shadow: none;
        }
        .transparent-stroke {
            -webkit-text-stroke: 1px #e2e8f0;
            color: transparent;
        }
    `}</style>
);

/* ─────────────────────────────────────────────────────────
    Three.js Abstract 3D Sculpture (Like Reference Image)
────────────────────────────────────────────────────────── */
function AbstractSculpture({ slide }: { slide: number }) {
    const ref = useRef<THREE.Group>(null);
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useFrame((state) => {
        if(ref.current) {
            const t = state.clock.elapsedTime;
            // 피조물이 더 '과감하게' 움직이도록 진폭과 속도 대폭 상향
            ref.current.rotation.y = Math.sin(t * 0.8) * 0.8;
            ref.current.rotation.z = Math.cos(t * 0.6) * 0.5;
            ref.current.position.y = Math.sin(t * 2.0) * 0.6;
            
            // 마우스 반응성 고조 (데스크톱에서는 왼쪽으로 -2.2 오프셋하여 배치)
            const baseOffset = isDesktop ? -2.2 : 0;
            const targetX = baseOffset + (state.pointer.x * 3.0);
            const targetY = (state.pointer.y * 3.0);
            ref.current.position.x += (targetX - ref.current.position.x) * 0.15;
            ref.current.position.y += (targetY - ref.current.position.y) * 0.15;
        }
    });
    
    return (
        <group ref={ref} position={[isDesktop ? -2.2 : 0, -0.5, 0]}>
            {slide === 0 && (
                <Float speed={4} rotationIntensity={1.5} floatIntensity={2}>
                    <mesh position={[0, 1.5, 0]} rotation={[0.4, 0.4, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[2.5, 2.5, 0.05, 64]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
                    </mesh>
                    <mesh position={[0.2, 0.5, 0.5]} rotation={[-0.4, 0.2, 0.1]} castShadow receiveShadow>
                        <cylinderGeometry args={[2.2, 2.2, 0.05, 64]} />
                        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
                    </mesh>
                    <mesh position={[0.4, -0.5, 1]} rotation={[0.2, 0.4, -0.2]} castShadow receiveShadow>
                        <cylinderGeometry args={[1.8, 1.8, 0.05, 64]} />
                        <meshStandardMaterial color="#f1f5f9" roughness={0.1} metalness={0.2} />
                    </mesh>
                    {/* Decorative fast-flying spheres */}
                    <mesh position={[-3, 2, 1]} castShadow>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.3} />
                    </mesh>
                    <mesh position={[3, -1.5, 0.5]} castShadow>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.3} />
                    </mesh>
                </Float>
            )}
            
            {slide === 1 && (
                <Float speed={5} rotationIntensity={3} floatIntensity={4}>
                    <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]} castShadow receiveShadow>
                        <boxGeometry args={[2.5, 2.5, 2.5]} />
                        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.3} />
                    </mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[3.2, 3.2, 3.2]} />
                        <meshStandardMaterial color="#64748b" wireframe={true} />
                    </mesh>
                    <mesh position={[3, 2, -1]} castShadow>
                        <octahedronGeometry args={[0.6]} />
                        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
                    </mesh>
                    <mesh position={[-2, -2.5, 1]} castShadow>
                        <octahedronGeometry args={[0.5]} />
                        <meshStandardMaterial color="#94a3b8" roughness={0.3} />
                    </mesh>
                </Float>
            )}

            {slide === 2 && (
                <Float speed={4.5} rotationIntensity={4} floatIntensity={3}>
                    <mesh position={[0, 0, 0]} castShadow receiveShadow>
                        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
                        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
                    </mesh>
                    <mesh position={[-3.5, 1.5, -1]} castShadow receiveShadow>
                        <torusGeometry args={[0.8, 0.1, 16, 50]} />
                        <meshStandardMaterial color="#cbd5e1" />
                    </mesh>
                    <mesh position={[3, -2, 1]} castShadow receiveShadow>
                        <torusGeometry args={[1.0, 0.2, 16, 50]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                </Float>
            )}
        </group>
    );
}

const SLIDES = [
    {
        title: <>The Choice <br/> to Increase <br/> The Value of Space</>,
        subtitle: "Architecture & AI",
        desc: "고객의 니즈와 법적 한계를 넘어선 최적의 공간을 제안합니다. 다년간의 노하우를 바탕으로 만족스러운 건축 자동화 솔루션을 약속드립니다.",
    },
    {
        title: <>Innovation <br/> in Architectural <br/> Intelligence</>,
        subtitle: "Generative Design",
        desc: "기존의 설계 방식을 탈피하여 알고리즘 기반의 혁신적인 3D 매스 제너레이션과 법규 분석 솔루션을 도입한 차세대 설계 방식을 경험하세요.",
    },
    {
        title: <>Sustainable <br/> and Parametric <br/> Masterplanning</>,
        subtitle: "Next-gen Platform",
        desc: "지속가능한 건축 환경을 위해 정확한 일조 시뮬레이션 및 동선 분석을 가능케 하는 매스형 마스터플래닝 에코시스템을 제공합니다.",
    }
];

/* ─────────────────────────────────────────────────────────
    Main LandingPage Component
────────────────────────────────────────────────────────── */
export default function LandingPage({ onEnter }: LandingPageProps) {
    const [apiKey, setApiKey] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setStoreApiKey = useProjectStore(s => s.setGeminiApiKey);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [slide, setSlide] = useState(0);

    const nextSlide = () => setSlide(s => (s + 1) % SLIDES.length);
    const prevSlide = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);

    useEffect(() => {
        const envKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (envKey && envKey.startsWith('AIza')) {
            console.log('[LandingPage] .env에서 Gemini API 키 감지');
            setApiKey(envKey);
        }
    }, []);

    const validateApiKey = async (key: string) => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${key}`);
            if (response.ok) return true;
            if (response.status === 403) {
                const data = await response.json();
                if (data.error?.message?.includes('leaked')) setError('차단된 API 키입니다.');
                else setError('권한이 없는 API 키입니다.');
                return false;
            } 
            if (response.status === 400) {
                setError('잘못된 API 형식입니다.');
                return false;
            }
            setError(`인증 실패 (${response.status})`);
            return false;
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
            return false;
        }
    };

    const handleEnter = async () => {
        setError(null);
        // By user request: "비밀번호 로그인 기능도 잠시 중지시켜줘. 그냥 로그인 버튼을 클릭하면 누구나 사용할 수 있도록"
        if (!apiKey.trim()) {
            // Provide a dummy key if none is provided so the app can function or bypass
            setStoreApiKey('demo_mode_no_key');
        } else {
            setStoreApiKey(apiKey.trim());
        }
        onEnter();
    };

    return (
        <div ref={scrollRef} className="h-screen w-full bg-[#f4f4f5] relative font-sans text-slate-900 overflow-x-hidden overflow-y-auto custom-scrollbar">
            <EditorialStyle />

            {/* ─── SECTION 01: HERO (Like refernece top image) ─── */}
            <section className="relative w-full h-[100svh] min-h-[700px] flex flex-col md:flex-row items-center pt-20 px-8 md:px-16 lg:px-24 bg-[#f1f2f3]">
                
                {/* Editorial Top Nav */}
                <div className="absolute top-10 left-8 md:left-24 text-[9px] tracking-[0.3em] uppercase font-bold text-slate-800 z-30">
                    ARCHE PLATFORM
                </div>
                <div className="absolute top-10 right-8 md:right-24 text-[9px] tracking-[0.2em] uppercase text-slate-500 hidden sm:flex gap-8 z-30">
                    <span className="cursor-pointer hover:text-black transition-colors">Architecture</span>
                    <span className="cursor-pointer hover:text-black transition-colors">Platform</span>
                    <span className="cursor-pointer hover:text-black transition-colors">Contact</span>
                </div>

                {/* Left side Abstract 3D Canvas */}
                <div className="absolute inset-0 w-full h-full z-20 pointer-events-none opacity-40 md:opacity-100">
                    <Canvas camera={{ position: [0, 0, 9], fov: 45 }} shadows>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
                        <AbstractSculpture slide={slide} />
                        <Environment preset="city" />
                        <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.15} far={10} color="#000000" position={[0, -2.5, 0]} />
                    </Canvas>
                </div>

                {/* Right side Typography */}
                <div className="relative z-10 md:w-1/2 flex flex-col items-end text-right justify-center h-full pb-20 md:pb-0 pointer-events-none mt-20 md:mt-0">
                    <AnimatePresence mode="wait">
                        <motion.h1 
                            key={`title-${slide}`}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.8, ease: "easeOut" }}
                            className="font-serif-elegant text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] text-slate-900 leading-[1.1] mb-12 tracking-tight"
                        >
                            {SLIDES[slide].title}
                        </motion.h1>
                    </AnimatePresence>
                    
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={`desc-${slide}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-start text-left ml-auto border-l border-slate-300 pl-6 max-w-[280px] h-[120px]"
                        >
                            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-slate-800">{SLIDES[slide].subtitle}</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                {SLIDES[slide].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows - Moved to absolute position at z-40 to prevent being blocked by the 3D Canvas */}
                <div className="absolute bottom-24 md:bottom-28 right-8 md:right-24 flex z-40">
                    <button onClick={prevSlide} className="w-14 h-14 bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={16} className="text-slate-500" strokeWidth={1.5} />
                    </button>
                    <button onClick={nextSlide} className="w-14 h-14 bg-slate-900 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors">
                        <ArrowRight size={16} className="text-white" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Pagination like reference - Expanded button hit target to w-6 h-6 and bumped to z-40 */}
                <div className="absolute bottom-12 md:bottom-20 left-8 md:left-24 flex items-center gap-1 text-sm font-serif-elegant tracking-widest z-40">
                    {SLIDES.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSlide(i)} 
                            className="w-6 h-6 flex items-center justify-center cursor-pointer group"
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <span className={`transition-all duration-300 rounded-full ${slide === i ? 'w-2 h-2 bg-slate-800' : 'w-1 h-1 bg-slate-300 group-hover:bg-slate-500'}`} />
                        </button>
                    ))}
                    <span className="ml-6 text-2xl text-slate-900 overflow-hidden w-10 text-center">
                        <AnimatePresence mode="wait">
                            <motion.span key={`number-${slide}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="inline-block">
                                0{slide + 1}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                    <span className="text-slate-400 text-xs mt-1">/ 0{SLIDES.length}</span>
                </div>
                {/* Scroll label */}
                <div className="absolute bottom-16 right-8 md:right-24 hidden md:flex items-center gap-4 z-30">
                    <span className="text-[9px] tracking-[0.2em] text-slate-500 uppercase">Scroll</span>
                    <div className="w-16 h-[1px] bg-slate-300"></div>
                </div>
            </section>


            {/* ─── SECTION 02: FEATURES (Editorial List Style) ─── */}
            <section className="w-full bg-white px-8 md:px-16 lg:px-24 py-32 md:py-48 relative">
                <div className="flex flex-col lg:flex-row justify-between mb-24 lg:mb-40 items-start lg:items-end">
                    <div className="relative mb-8 lg:mb-0">
                        <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif-elegant transparent-stroke pointer-events-none select-none">
                            SPECIAL
                        </h2>
                        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-serif-elegant text-slate-900 absolute top-1/2 left-4 md:left-12 -translate-y-1/2">
                            SPACES
                        </h2>
                    </div>
                    <div className="flex flex-col items-start lg:max-w-[320px] pb-6 border-b border-slate-200">
                        <p className="text-[11px] text-slate-500 leading-relaxed text-justify mb-4 font-medium">
                            건축 설계의 처음과 끝, 모든 복잡한 과정을 하나로 통합합니다. 
                            자동화된 AI 분석과 시각화 엔진을 통해 건축의 본질에 집중할 수 있도록 지원합니다.
                        </p>
                    </div>
                </div>

                {/* Minimalist 4-Column Feature List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-slate-200">
                    {features.map((feature, idx) => (
                        <motion.div 
                            key={feature.id} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: (idx % 4) * 0.1, ease: 'easeOut' }}
                            className="feature-block group relative bg-white border-r border-b border-slate-200 p-8 lg:p-10 min-h-[300px] flex flex-col justify-between overflow-hidden cursor-pointer"
                        >
                            {/* Hover Inversion Background */}
                            <div className="absolute inset-0 bg-[#161616] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-[9px] uppercase tracking-widest text-slate-400 group-hover:text-neutral-500 transition-colors mb-12">
                                    <span className="font-bold text-slate-800 group-hover:text-white transition-colors">{String(idx+1).padStart(2, '0')}</span> / 12
                                </div>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="font-serif-elegant text-xl lg:text-2xl text-slate-900 group-hover:text-white transition-colors">
                                            {feature.title}
                                        </h3>
                                        <feature.icon size={18} className="text-slate-300 group-hover:text-white/30 transition-colors" strokeWidth={1} />
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
                                        {feature.desc}
                                    </p>
                                    
                                    {/* Status Badge */}
                                    <div className="mt-6 pt-6 border-t border-slate-100 group-hover:border-white/10 transition-colors flex items-center justify-between">
                                        <span className="text-[9px] font-medium tracking-widest uppercase text-slate-400 group-hover:text-neutral-500 transition-colors">Status</span>
                                        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${feature.status === '완료' ? 'text-slate-800 group-hover:text-white' : 'text-slate-400 group-hover:text-neutral-500'}`}>
                                            {feature.status === '완료' ? 'Implemented' : 'Scheduled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Pagination indicator for features */}
                <div className="absolute bottom-12 right-8 md:right-24 hidden lg:flex flex-col items-center text-xs font-serif-elegant space-y-4">
                    <span className="text-slate-400">↑</span>
                    <span>02 / 03</span>
                    <span className="text-slate-400">↓</span>
                </div>
            </section>

            {/* ─── SECTION 02.5: RECENT UPDATES ─── */}
            <section className="w-full bg-[#f8fafc] px-8 md:px-16 lg:px-24 py-32 relative border-t border-slate-200">
                <div className="flex flex-col lg:flex-row justify-between mb-24 items-start lg:items-end">
                    <div className="relative mb-8 lg:mb-0">
                        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-serif-elegant text-slate-900 tracking-tight leading-none mb-6">
                            LATEST <br/> RELEASES
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-slate-400"></span>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-bold">Version 3.0 Updates</span>
                        </div>
                    </div>
                    <div className="lg:max-w-[400px]">
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            ARCHE 플랫폼의 핵심인 9개 Phase C 특화 엔지니어링 모듈의 전면 리팩토링 및 
                            과업지시서 파싱을 위한 Zero-Dropout AI 엔진 연동이 성공적으로 완료되었습니다.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-slate-200">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="p-10 border-r border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff7b00] uppercase mb-6 block">2026.04.10</span>
                        <h3 className="text-2xl font-serif-elegant text-slate-900 mb-4">Phase C 동적 데이터 연동</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            C-1부터 C-9까지의 9개 엔지니어링 패널이 하드코딩 템플릿 방식에서 벗어나, Gemini 기반 프로젝트 특화 데이터를 실시간으로 소비하는 지능형 대시보드로 격상되었습니다.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="p-10 border-r border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff7b00] uppercase mb-6 block">2026.04.09</span>
                        <h3 className="text-2xl font-serif-elegant text-slate-900 mb-4">AI 파싱 엔진 고도화</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            과업지시서 분석 시 단순 정규식(Regex)을 초월하여 AI가 문맥 전체를 인지하고 제원을 완벽히 1대1 매핑하는 Zero-Dropout 프롬프트를 신규 적용했습니다.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-10 border-r border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff7b00] uppercase mb-6 block">2026.04.07</span>
                        <h3 className="text-2xl font-serif-elegant text-slate-900 mb-4">브랜드 CI 디자인 통합</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            전 패널에 걸쳐 범람하던 고전적 시스템 컬러를 걷어내고, Haema Orange 중심의 프리미엄 12-Column 디자인 레이아웃으로 완벽한 통일감을 구사합니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ─── SECTION 03: AUTH / CONTACT (Dark Theme Footer) ─── */}
            <section className="w-full bg-[#161616] text-white px-8 md:px-16 lg:px-24 py-32 flex flex-col lg:flex-row justify-between relative">
                {/* Aesthetic background stripes overlay (like the reference dark section) */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }} />

                <div className="lg:w-1/2 flex flex-col justify-between mb-24 lg:mb-0 relative z-10">
                    <div>
                        <h2 className="font-serif-elegant text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-12">
                            Add value <br/> to space
                        </h2>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-6 h-[1px] bg-white text-white"></span>
                            <p className="text-[10px] text-neutral-300 tracking-widest uppercase">We can make your dreams come true</p>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed max-w-[300px]">
                            우리는 다양한 대안들이 일상에 미치는 긍정적인 영향을 믿는 열정적 개척자입니다. 플랫폼에 온전하게 접근하기 위해 인가된 식별 정보를 입력하십시오.
                        </p>
                    </div>
                    
                    <div className="mt-32">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <div className="text-[9px] tracking-[0.2em] uppercase text-white">Company Info</div>
                        </div>
                        <p className="text-[9px] text-neutral-600 tracking-widest">© 2026 ARCHE ARCHITECTURE. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
                
                <div className="lg:w-5/12 flex flex-col justify-center relative z-10">
                    {/* Brand email / contact mockup */}
                    <div className="flex items-center gap-6 mb-20">
                        <span className="font-serif-elegant italic text-4xl text-white">&.</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-medium tracking-wide text-white">
                                ARCHE PLATFORM
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-12 gap-y-16 mb-4">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold tracking-widest text-neutral-300 mb-2">OPEN ACCESS DEMONSTRATION</h3>
                            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                                임시 데모 시스템입니다. 아래 버튼을 눌러 플랫폼에 바로 접속하실 수 있습니다.
                            </p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#ff5555] text-[11px] mb-8 font-medium tracking-wide">
                                * {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-end">
                        <button 
                            onClick={handleEnter}
                            disabled={isLoading}
                            className="bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] py-6 px-12 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : 'Enter Platform'} 
                        </button>
                        <div className="mt-4 text-[9px] text-neutral-600 tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 border border-neutral-600 inline-block"></span>
                            개인정보처리방침 허가
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
