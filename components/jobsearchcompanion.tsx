"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Pause, Play, RefreshCw, Music2, ActivitySquare, Heart } from 'lucide-react';

interface RegulationStrategy {
  type: 'movement' | 'music' | 'presence';
  Icon: React.ComponentType<any>;
  title: string;
  prompts: string[];
}

interface Step {
  title: string;
  prompt: string;
  field: keyof Notes;
}

interface Notes {
  regulation: string;
  draws: string;
  concerns: string;
  skills: string;
  bodyFeel: string;
}

const regulationStrategies: RegulationStrategy[] = [
  {
    type: 'movement',
    Icon: ActivitySquare,
    title: 'Movement Break',
    prompts: [
      '30 seconds of gentle stretching',
      'Walk around your space',
      'Quick set of jumping jacks',
      'Stand and shake out your arms and legs'
    ]
  },
  {
    type: 'music',
    Icon: Music2,
    title: 'Music Moment',
    prompts: [
      'Put on your energizing playlist',
      'Take 3 deep breaths with the rhythm',
      'Drum your fingers to the beat',
      'Let the music ground you in your body'
    ]
  },
  {
    type: 'presence',
    Icon: Heart,
    title: 'Mindful Presence',
    prompts: [
      'Notice 3 things you can hear',
      'Feel your feet on the ground',
      'Follow your breath for 3 cycles',
      'Scan your body from head to toe'
    ]
  }
];

const steps: Step[] = [
  {
    title: "Body Check-in",
    prompt: "Take a moment to notice how your body feels right now. Any tension or ease?",
    field: "bodyFeel"
  },
  {
    title: "What Draws You?",
    prompt: "What aspects of this role spark your interest or energy? Notice any physical response as you consider this.",
    field: "draws"
  },
  {
    title: "Concerns or Questions",
    prompt: "What makes you hesitate? Notice if your body tenses when thinking about certain aspects - this is valuable information.",
    field: "concerns"
  },
  {
    title: "Skills Overlap",
    prompt: "What skills do you already have? Remember times you've successfully used these skills.",
    field: "skills"
  }
];

const JobSearchCompanion: React.FC = () => {
  const [time, setTime] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showRegulationPrompt, setShowRegulationPrompt] = useState<boolean>(true);
  const [selectedRegulation, setSelectedRegulation] = useState<RegulationStrategy | null>(null);
  const [notes, setNotes] = useState<Notes>({
    regulation: '',
    draws: '',
    concerns: '',
    skills: '',
    bodyFeel: ''
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time % 300 === 0 && time !== 1500) {
            setShowRegulationPrompt(true);
          }
          return time - 1;
        });
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setShowRegulationPrompt(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  const toggleTimer = (): void => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (): void => {
    setTime(25 * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNotes({
      ...notes,
      [e.target.name]: e.target.value
    });
  };

  const selectRegulationStrategy = (strategy: RegulationStrategy): void => {
    setSelectedRegulation(strategy);
    setShowRegulationPrompt(false);
  };

  const getRandomPrompt = (prompts: string[]): string => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Job Search Session</span>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="text-xl font-mono">{formatTime(time)}</span>
            <Button variant="ghost" size="icon" onClick={toggleTimer}>
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={resetTimer}>
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showRegulationPrompt && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-3">Regulation Break</h3>
            <p className="text-sm mb-4">Choose a strategy that feels right for this moment:</p>
            <div className="flex gap-3">
              {regulationStrategies.map((strategy) => (
                <Button
                  key={strategy.type}
                  variant="outline"
                  className="flex-1"
                  onClick={() => selectRegulationStrategy(strategy)}
                >
                  <strategy.Icon className="w-4 h-4 mr-2" />
                  {strategy.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedRegulation && !showRegulationPrompt && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium mb-2">{selectedRegulation.title}</h3>
            <p className="text-sm">{getRandomPrompt(selectedRegulation.prompts)}</p>
            <Button 
              className="mt-3"
              variant="outline"
              onClick={() => setSelectedRegulation(null)}
            >
              Done
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">{steps[currentStep].title}</h3>
            <p className="text-slate-600 mb-4">{steps[currentStep].prompt}</p>
            <textarea
              name={steps[currentStep].field}
              value={notes[steps[currentStep].field]}
              onChange={handleNoteChange}
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Type your thoughts here..."
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSearchCompanion;