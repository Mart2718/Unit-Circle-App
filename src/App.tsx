
import React, { useState, useMemo } from 'react';
import { UnitCircle } from './components/UnitCircle';
import { TrigWaves } from './components/TrigWaves';
import { QuizMode } from './components/QuizMode';
import { getAngleInfo } from './lib/math';
import { 
  Settings2, 
  GraduationCap, 
  Presentation, 
  Magnet, 
  Eye, 
  EyeOff,
  ChevronRight,
  Info,
  CircleHelp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [angle, setAngle] = useState(30);
  const [snapMode, setSnapMode] = useState(true);
  const [teacherMode, setTeacherMode] = useState(true);
  const [activeQuadrant, setActiveQuadrant] = useState<number | null>(null);
  const [showWaves, setShowWaves] = useState(true);
  const [showSine, setShowSine] = useState(true);
  const [showCosine, setShowCosine] = useState(true);
  const [showTangent, setShowTangent] = useState(false);

  const info = useMemo(() => getAngleInfo(angle), [angle]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fc2f15] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <Settings2 className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">TrigCircle</h1>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Interactive Unit Circle Explorer</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <Button 
                  variant={!teacherMode ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTeacherMode(false)}
                  className="h-8 gap-2 px-3"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Student</span>
                </Button>
                <Button 
                  variant={teacherMode ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setTeacherMode(true)}
                  className="h-8 gap-2 px-3"
                >
                  <Presentation className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Teacher</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mode Controls */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Controls</h2>
                <Badge variant="outline" className="text-[10px] font-mono tracking-tighter">v1.0.0</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", snapMode ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500")}>
                      <Magnet className="w-4 h-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold">Snap to Standard</Label>
                      <p className="text-[10px] text-slate-500">Locks to 30°, 45°, 60° multiples</p>
                    </div>
                  </div>
                  <Switch checked={snapMode} onCheckedChange={setSnapMode} />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider px-1">Quadrant Lens</Label>
                  <div className="grid grid-cols-5 gap-1">
                    <Button 
                      variant={activeQuadrant === null ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveQuadrant(null)}
                      className="text-[10px] h-8"
                    >
                      All
                    </Button>
                    {[1, 2, 3, 4].map(q => (
                      <Button 
                        key={q}
                        variant={activeQuadrant === q ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setActiveQuadrant(q)}
                        className="text-[10px] h-8"
                      >
                        Q{q}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Live Values */}
            <AnimatePresence mode="wait">
              {teacherMode && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Info className="w-24 h-24" />
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Live Analysis</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-400 uppercase">Degrees</Label>
                        <div className="text-2xl font-black">{info.degrees}°</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-400 uppercase">Radians</Label>
                        <div className="text-2xl font-black">{info.radians}</div>
                      </div>
                    </div>

                    <Separator className="my-4 bg-slate-800" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] text-slate-400 uppercase">Coordinates (x, y)</Label>
                        <Badge className="bg-blue-500/20 text-blue-400 border-none">Exact</Badge>
                      </div>
                      <div className="text-3xl font-mono font-bold tracking-tighter">
                        ({info.exact.x}, {info.exact.y})
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-bold">Sin θ</div>
                        <div className="text-sm font-bold text-green-400">{info.exact.y}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {info.quadrant === 1 || info.quadrant === 2 ? "(+)" : "(-)"}
                        </div>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-bold">Cos θ</div>
                        <div className="text-sm font-bold text-red-400">{info.exact.x}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {info.quadrant === 1 || info.quadrant === 4 ? "(+)" : "(-)"}
                        </div>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500 uppercase font-bold">Ref ∠</div>
                        <div className="text-sm font-bold text-blue-400">{info.referenceAngle}°</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Q{info.quadrant}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Quiz Mode in Student View */}
            {!teacherMode && <QuizMode />}
          </div>

          {/* Middle Column: The Circle */}
          <div className="lg:col-span-5 space-y-6">
            <UnitCircle 
              angle={angle} 
              setAngle={setAngle} 
              snapMode={snapMode}
              activeQuadrant={activeQuadrant}
              showValues={teacherMode}
            />
            
            {/* Quick Angle Select */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 px-1">
                <CircleHelp className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Quick Select</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[0, 30, 45, 60, 90, 120, 135, 150, 180, 270].map(a => (
                  <Button 
                    key={a}
                    variant={angle === a ? "default" : "secondary"} 
                    size="sm"
                    onClick={() => setAngle(a)}
                    className="h-7 px-2.5 text-[10px] font-bold"
                  >
                    {a}°
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Waves & Extra */}
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Wave Generator</h2>
                <Switch checked={showWaves} onCheckedChange={setShowWaves} />
              </div>

              {showWaves && (
                <div className="space-y-4">
                  <TrigWaves 
                    info={info} 
                    showSine={showSine} 
                    showCosine={showCosine} 
                    showTangent={showTangent} 
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase text-green-600">Sine Wave</Label>
                      <Switch checked={showSine} onCheckedChange={setShowSine} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase text-red-600">Cosine Wave</Label>
                      <Switch checked={showCosine} onCheckedChange={setShowCosine} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase text-amber-600">Tangent Wave</Label>
                      <Switch checked={showTangent} onCheckedChange={setShowTangent} />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="bg-[#feffef] rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-yellow-900 font-bold text-sm mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Learning Tip
              </h3>
              <p className="text-yellow-700 text-xs leading-relaxed">
                Notice how the <span className="font-bold">y-coordinate</span> of the point on the circle is exactly the same as the <span className="font-bold text-green-700">sine value</span> on the wave. As the point moves up and down, the wave follows.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto p-6 border-t border-slate-200 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              © 2026 TrigCircle Interactive Education
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest transition-colors">Documentation</a>
              <a href="#" className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest transition-colors">Curriculum Guide</a>
              <a href="#" className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest transition-colors">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
