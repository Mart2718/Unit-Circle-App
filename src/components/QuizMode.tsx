
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STANDARD_ANGLES, getAngleInfo, AngleInfo } from '@/src/lib/math';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuizMode: React.FC = () => {
  const [targetAngle, setTargetAngle] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [quizType, setQuizType] = useState<'angle-to-coord' | 'coord-to-angle'>('angle-to-coord');

  const generateQuestion = () => {
    const randomAngle = STANDARD_ANGLES[Math.floor(Math.random() * STANDARD_ANGLES.length)];
    setTargetAngle(randomAngle);
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [quizType]);

  const info = getAngleInfo(targetAngle);

  const checkAnswer = () => {
    if (quizType === 'angle-to-coord') {
      // Expecting something like "(sqrt(3)/2, 1/2)" or "sqrt(3)/2, 1/2"
      const normalizedUser = userAnswer.replace(/\s/g, '').toLowerCase();
      const expected = `(${info.exact.x},${info.exact.y})`.replace(/\s/g, '').toLowerCase();
      const expectedNoParen = `${info.exact.x},${info.exact.y}`.replace(/\s/g, '').toLowerCase();
      
      if (normalizedUser === expected || normalizedUser === expectedNoParen) {
        setFeedback('correct');
      } else {
        setFeedback('incorrect');
      }
    } else {
      if (parseInt(userAnswer) === targetAngle) {
        setFeedback('correct');
      } else {
        setFeedback('incorrect');
      }
    }
  };

  return (
    <Card className="w-full border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-bottom border-slate-200 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Self-Quiz Mode</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={quizType === 'angle-to-coord' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setQuizType('angle-to-coord')}
              className="h-7 text-[10px]"
            >
              Angle → Coord
            </Button>
            <Button 
              variant={quizType === 'coord-to-angle' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setQuizType('coord-to-angle')}
              className="h-7 text-[10px]"
            >
              Coord → Angle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Question</div>
            <div className="text-3xl font-black text-slate-900">
              {quizType === 'angle-to-coord' ? (
                <span>What are the coordinates for <span className="text-blue-600">{targetAngle}°</span>?</span>
              ) : (
                <span>What angle has coordinates <span className="text-blue-600">({info.exact.x}, {info.exact.y})</span>?</span>
              )}
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <div className="relative">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={quizType === 'angle-to-coord' ? "(x, y)" : "Degrees"}
                className="text-center text-lg h-12 font-mono"
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -right-10 top-1/2 -translate-y-1/2"
                  >
                    {feedback === 'correct' ? (
                      <CheckCircle2 className="text-green-500 w-8 h-8" />
                    ) : (
                      <XCircle className="text-red-500 w-8 h-8" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 h-11" onClick={checkAnswer}>Check Answer</Button>
              <Button variant="outline" className="px-3 h-11" onClick={generateQuestion}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {feedback === 'incorrect' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100"
            >
              Hint: The answer is <span className="font-bold text-slate-700">
                {quizType === 'angle-to-coord' ? `(${info.exact.x}, ${info.exact.y})` : `${targetAngle}°`}
              </span>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
