"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar as UIAvatar, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { RequireWallet } from "@/components/RequireWallet";
import { useGamification } from "@/lib/gamification";
import { saveCustomAllocation } from "@/lib/strategy-storage";
import { motion, AnimatePresence } from "motion/react";
import type {
  ChatMessage,
  AIResponse,
  StrategyAllocation,
  RiskLevel,
} from "@/lib/ai/types";

// Initial greeting message
const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "assistant",
  content:
    "Welcome to MeNabung! I'm your AI financial advisor here to help optimize your IDRX growth based on your risk profile. To get started, tell me about your financial goals and how much you'd like to allocate.",
  timestamp: Date.now(),
};

// Risk level labels
const RISK_LABELS: Record<RiskLevel, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Aggressive",
};

// Strategy info
const STRATEGY_INFO = {
  options: {
    name: "Thetanuts Options",
    description: "Options strategy for premium yields",
  },
  lp: {
    name: "Liquidity Pool",
    description: "Provide liquidity to earn trading fees",
  },
  staking: {
    name: "Staking",
    description: "Lock assets for stable rewards",
  },
};

// Animation variants - typed as const to satisfy motion/react types
const messageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const typingDotVariants = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const strategyItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const },
  }),
};

export default function ChatPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { completeMission } = useGamification();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAllocation, setLastAllocation] =
    useState<StrategyAllocation | null>(null);
  const [lastRiskLevel, setLastRiskLevel] = useState<RiskLevel | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasCompletedMission, setHasCompletedMission] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // RequireWallet handles the redirect now

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Complete ask_ai mission on first message
      if (!hasCompletedMission) {
        completeMission("ask_ai");
        setHasCompletedMission(true);
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Gagal mendapat respons dari AI");
        }

        if (data.response) {
          const aiResponse: AIResponse = data.response;

          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: aiResponse.message,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          if (aiResponse.allocation) {
            setLastAllocation(aiResponse.allocation);
          }
          if (aiResponse.riskLevel) {
            setLastRiskLevel(aiResponse.riskLevel);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Network error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <RequireWallet>
      <div className="h-dvh bg-cream flex flex-col overflow-hidden">
        {/* Animated Header */}
        <Header />

        {/* Spacer for fixed header - responsive for mobile nav */}
        <div className="h-14 sm:h-16 flex-shrink-0" />
        {isConnected && <div className="h-12 md:hidden flex-shrink-0" />}

        {/* Main chat area */}
        <div className="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full px-0 sm:px-4">
          {/* Risk profile indicator */}
          <AnimatePresence>
            {lastRiskLevel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="px-4 py-2 border-b border-border bg-white overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk Profile Detected
                  </span>
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="text-sm font-medium text-teal bg-cream-dark px-3 py-1 rounded-md"
                  >
                    {RISK_LABELS[lastRiskLevel]}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 scroll-smooth">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%]">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.1,
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                        className="hidden sm:block"
                      >
                        <UIAvatar className="w-8 h-8 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-teal text-white text-xs font-medium">
                            AI
                          </AvatarFallback>
                        </UIAvatar>
                      </motion.div>
                      <div className="flex flex-col gap-1">
                        <Card className="shadow-card border-0 py-0">
                          <CardContent className="p-3 sm:p-4">
                            <p className="text-sm text-pretty leading-relaxed text-foreground whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </CardContent>
                        </Card>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-xs text-muted-foreground pl-1"
                        >
                          {formatTime(message.timestamp)}
                        </motion.span>
                      </div>
                    </div>
                  )}

                  {message.role === "user" && (
                    <div className="flex flex-col items-end gap-1 max-w-[92%] sm:max-w-[85%]">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className="bg-teal text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2.5 sm:py-3"
                      >
                        <p className="text-sm text-pretty leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-xs text-muted-foreground pr-1"
                      >
                        {formatTime(message.timestamp)}
                      </motion.span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator with typing animation */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2 sm:gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <UIAvatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-teal text-white text-xs font-medium">
                        AI
                      </AvatarFallback>
                    </UIAvatar>
                  </motion.div>
                  <Card className="shadow-card border-0 py-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Analyzing
                        </span>
                        <span className="inline-flex gap-1 ml-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              variants={typingDotVariants}
                              animate="animate"
                              style={{ animationDelay: `${i * 0.15}s` }}
                              transition={{ delay: i * 0.15 }}
                              className="w-1.5 h-1.5 bg-teal rounded-full"
                            />
                          ))}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Strategy Recommendation Card with hover effects */}
            <AnimatePresence>
              {lastAllocation && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex gap-2 sm:gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <UIAvatar className="w-8 h-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-gold text-white text-xs font-medium">
                        RP
                      </AvatarFallback>
                    </UIAvatar>
                  </motion.div>
                  <Card className="shadow-card border-0 py-0 flex-1 max-w-full sm:max-w-[85%]">
                    <CardContent className="p-3 sm:p-4">
                      <motion.h4
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="font-display font-semibold text-sm text-teal mb-3 sm:mb-4 text-balance"
                      >
                        Strategy Allocation
                      </motion.h4>
                      <div className="space-y-2 sm:space-y-3">
                        {/* Options */}
                        <motion.div
                          custom={0}
                          variants={strategyItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.15 },
                          }}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-cream rounded-lg cursor-pointer transition-shadow hover:shadow-sm"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {STRATEGY_INFO.options.name}
                            </p>
                            <p className="text-xs text-muted-foreground text-pretty">
                              {STRATEGY_INFO.options.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3, duration: 0.2 }}
                              className="text-lg font-display font-semibold text-teal tabular-nums"
                            >
                              {lastAllocation.options}%
                            </motion.span>
                          </div>
                        </motion.div>

                        {/* LP */}
                        <motion.div
                          custom={1}
                          variants={strategyItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.15 },
                          }}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-cream rounded-lg cursor-pointer transition-shadow hover:shadow-sm"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {STRATEGY_INFO.lp.name}
                            </p>
                            <p className="text-xs text-muted-foreground text-pretty">
                              {STRATEGY_INFO.lp.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4, duration: 0.2 }}
                              className="text-lg font-display font-semibold text-teal tabular-nums"
                            >
                              {lastAllocation.lp}%
                            </motion.span>
                          </div>
                        </motion.div>

                        {/* Staking */}
                        <motion.div
                          custom={2}
                          variants={strategyItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{
                            scale: 1.01,
                            transition: { duration: 0.15 },
                          }}
                          className="flex items-center justify-between p-2.5 sm:p-3 bg-cream rounded-lg cursor-pointer transition-shadow hover:shadow-sm"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {STRATEGY_INFO.staking.name}
                            </p>
                            <p className="text-xs text-muted-foreground text-pretty">
                              {STRATEGY_INFO.staking.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5, duration: 0.2 }}
                              className="text-lg font-display font-semibold text-teal tabular-nums"
                            >
                              {lastAllocation.staking}%
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="mt-4 pt-3 border-t border-border space-y-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Button
                            onClick={() => {
                              if (lastAllocation) {
                                saveCustomAllocation(lastAllocation);
                              }
                              router.push("/deposit");
                            }}
                            className="w-full bg-teal hover:bg-teal-light text-white"
                          >
                            Start Growing 🌱
                          </Button>
                        </motion.div>
                        <Link href="/dashboard" className="block">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-teal text-teal hover:bg-cream-dark"
                            >
                              View in Dashboard
                            </Button>
                          </motion.div>
                        </Link>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions - only show early in conversation */}
          <AnimatePresence>
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="px-3 sm:px-4 pb-3 border-t border-border bg-white pt-3"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Quick actions:
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    {
                      text: "Safe investment",
                      action: "I'm a beginner and want to invest safely",
                    },
                    {
                      text: "5M IDRX",
                      action: "I have 5 million IDRX to diversify",
                    },
                    {
                      text: "High returns",
                      action: "I'm experienced and want to maximize returns",
                    },
                    {
                      text: "Thetanuts?",
                      action: "Explain the Thetanuts Options strategy",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(item.action)}
                        className="text-xs"
                      >
                        {item.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area with focus animation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="border-t border-border bg-white p-3 sm:p-4 pb-4 sm:pb-5 flex-shrink-0"
          >
            <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
              <motion.div
                className="flex-1 relative"
                animate={{
                  scale: isFocused ? 1.005 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What are your goals?"
                  className={`pr-4 py-5 bg-cream border-border transition-all duration-150 text-base ${
                    isFocused ? "ring-2 ring-teal/20 border-teal" : ""
                  }`}
                  disabled={isLoading}
                />
                {/* Error shown next to input */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -bottom-5 left-0 text-xs text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-teal hover:bg-teal-light text-white px-4 sm:px-6 transition-all duration-150"
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  ) : (
                    "Send"
                  )}
                </Button>
              </motion.div>
            </form>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center text-pretty"
            >
              Not financial advice. DYOR.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </RequireWallet>
  );
}
