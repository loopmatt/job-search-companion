"use client"; // Add this at the top of the file

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Pause, Play, RefreshCw } from 'lucide-react';

interface Notes {
  draws: string;
  concerns: string;
  skills: string;
  bodyFeel: string;
}

interface Step {
  title: string;
  prompt: string;
  field: keyof Notes;
}

const JobSearchCompanion: React.FC = () => {
  const [time, setTime] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [notes, setNotes] = useState<Notes>({
    draws: '',
    concerns: '',
    skills: '',
    bodyFeel: ''
  });

  const steps: Step[] = [
    {
      title: "Grounding Check-in",
      prompt: "Take a deep breath. Notice the coffee shop atmosphere. How does your body feel right now?",
      field: "bodyFeel"
    },
    {
      title: "What Draws You?",
      prompt: "What aspects of this role spark your interest? No judgment, just note what catches your attention.",
      field: "draws"
    },
    {
      title: "Concerns or Questions",
      prompt: "What makes you hesitate or want to know more? Remember, concerns are normal and helpful.",
      field: "concerns"
    },
    {
      title: "Skills Overlap",
      prompt: "What skills do you already have that align with this role? Include both technical and soft skills.",
      field: "skills"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
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
    const { name, value } = e.target;
    setNotes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Job Analysis Session</span>
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
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button 
              onClick={nextStep}
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