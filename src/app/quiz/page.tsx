'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { RequireWallet } from '@/components/RequireWallet';
import { FadeUp, AnimatedCard, AnimatedButton } from '@/components/motion';
import { useGamification } from '@/lib/gamification';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: 'conservative' | 'balanced' | 'aggressive';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'How long do you plan to hold your investment?',
    options: [
      { text: 'Less than 6 months', value: 'conservative' },
      { text: '6 months - 2 years', value: 'balanced' },
      { text: 'More than 2 years', value: 'aggressive' },
    ],
  },
  {
    id: 2,
    question: 'How would you react if your portfolio dropped 20%?',
    options: [
      { text: 'Panic and want to sell everything', value: 'conservative' },
      { text: 'Slightly worried but stay calm', value: 'balanced' },
      { text: 'See it as a buying opportunity', value: 'aggressive' },
    ],
  },
  {
    id: 3,
    question: 'What is your main investment goal?',
    options: [
      { text: 'Protect my money from inflation', value: 'conservative' },
      { text: 'Stable growth with controlled risk', value: 'balanced' },
      { text: 'Maximum growth, willing to take risks', value: 'aggressive' },
    ],
  },
];

const riskProfiles = {
  conservative: {
    name: 'Conservative',
    description: 'You prioritize capital security over high growth.',
    allocation: { options: 20, lp: 30, staking: 50 },
    color: 'text-teal',
  },
  balanced: {
    name: 'Balanced',
    description: 'You seek a balance between growth and security.',
    allocation: { options: 40, lp: 40, staking: 20 },
    color: 'text-gold-dark',
  },
  aggressive: {
    name: 'Aggressive',
    description: 'You are ready to take higher risks for greater potential returns.',
    allocation: { options: 50, lp: 35, staking: 15 },
    color: 'text-terracotta',
  },
};

export default function QuizPage() {
  const router = useRouter();
  const { completeMission } = useGamification();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<'conservative' | 'balanced' | 'aggressive' | null>(null);

  const progress = ((currentQuestion) / questions.length) * 100;

  // Complete mission when quiz is finished
  useEffect(() => {
    if (result) {
      completeMission('know_yourself');
    }
  }, [result, completeMission]);

  const handleAnswer = (value: 'conservative' | 'balanced' | 'aggressive') => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const counts = {
        conservative: newAnswers.filter(a => a === 'conservative').length,
        balanced: newAnswers.filter(a => a === 'balanced').length,
        aggressive: newAnswers.filter(a => a === 'aggressive').length,
      };

      const profile = Object.entries(counts).reduce((a, b) =>
        counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b
      )[0] as 'conservative' | 'balanced' | 'aggressive';

      setResult(profile);
    }
  };

  const handleStartChat = () => {
    // Store result in localStorage for the chat to use
    if (result) {
      localStorage.setItem('riskProfile', result);
    }
    router.push('/chat');
  };

  if (result) {
    const profile = riskProfiles[result];
    return (
      <RequireWallet>
      <main className="min-h-dvh bg-cream">
        <Header />
        <div className="h-14 sm:h-16" /> {/* Spacer for fixed header */}

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <FadeUp>
            <Card className="shadow-card">
              <CardHeader className="text-center pb-2 sm:pb-4 px-4 sm:px-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mx-auto mb-3 sm:mb-4"
                >
                  <ProfileIcon profile={result} />
                </motion.div>
                <CardTitle className="font-display text-xl sm:text-2xl text-balance">
                  Your Risk Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <h2 className={cn('font-display text-2xl sm:text-3xl font-semibold mb-2', profile.color)}>
                    {profile.name}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                    {profile.description}
                  </p>
                </motion.div>

                {/* Allocation Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-cream-dark rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
                >
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Recommended Allocation
                  </h3>

                  <div className="space-y-3">
                    <AnimatedAllocationBar
                      label="Thetanuts Options"
                      percentage={profile.allocation.options}
                      color="bg-teal"
                      delay={0.5}
                    />
                    <AnimatedAllocationBar
                      label="Aerodrome LP"
                      percentage={profile.allocation.lp}
                      color="bg-gold"
                      delay={0.6}
                    />
                    <AnimatedAllocationBar
                      label="IDRX Staking"
                      percentage={profile.allocation.staking}
                      color="bg-terracotta"
                      delay={0.7}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4"
                >
                  <AnimatedButton>
                    <Button
                      onClick={handleStartChat}
                      className="w-full bg-teal hover:bg-teal-light text-white h-11 sm:h-12 font-medium text-sm sm:text-base"
                    >
                      Continue to AI
                      <ArrowRightIcon className="ml-2 size-4" />
                    </Button>
                  </AnimatedButton>
                  <AnimatedButton>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentQuestion(0);
                        setAnswers([]);
                        setResult(null);
                      }}
                      className="w-full h-11 sm:h-12 text-sm sm:text-base"
                    >
                      Retake
                    </Button>
                  </AnimatedButton>
                </motion.div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </main>
      </RequireWallet>
    );
  }

  const question = questions[currentQuestion];

  return (
    <RequireWallet>
    <main className="min-h-dvh bg-cream">
      <Header />
      <div className="h-14 sm:h-16" /> {/* Spacer for fixed header */}

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Progress */}
        <FadeUp>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-xs sm:text-sm font-medium text-teal tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mb-6 sm:mb-8">
            <div className="h-1.5 sm:h-2 bg-cream-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card">
              <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
                <CardTitle className="font-display text-lg sm:text-xl text-balance leading-relaxed">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(option.value)}
                    className={cn(
                      'w-full text-left p-3 sm:p-4 rounded-lg border-2 border-border',
                      'hover:border-teal hover:bg-cream-dark',
                      'active:bg-cream-dark',
                      'transition-colors duration-150',
                      'focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2'
                    )}
                  >
                    <span className="text-sm sm:text-base text-pretty">{option.text}</span>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 sm:mt-6 text-center"
        >
          <Link
            href="/chat"
            className="text-xs sm:text-sm text-muted-foreground hover:text-teal transition-colors"
          >
            Skip quiz
          </Link>
        </motion.div>
      </div>
    </main>
    </RequireWallet>
  );
}

function AnimatedAllocationBar({
  label,
  percentage,
  color,
  delay = 0,
}: {
  label: string;
  percentage: number;
  color: string;
  delay?: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="tabular-nums font-medium"
        >
          {percentage}%
        </motion.span>
      </div>
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
}

function ProfileIcon({ profile }: { profile: 'conservative' | 'balanced' | 'aggressive' }) {
  const icons = {
    conservative: (
      <svg className="size-16 text-teal" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M32 18v14l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    balanced: (
      <svg className="size-16 text-gold-dark" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8v48M16 24h32M16 40h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    aggressive: (
      <svg className="size-16 text-terracotta" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 8L56 56H8L32 8Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M32 24v16M32 44v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[profile];
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
