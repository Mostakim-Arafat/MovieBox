"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm the MovieBox assistant, built by Alomgir Hossain for team EG-1305.3-House of webDev. Ask me about movies, TV shows, or anything about MovieBox!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.reply },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Sorry, something went wrong. Please try again.",
                    },
                ]);
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I couldn't connect. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700"
            >
                {isOpen ? "✕" : "💬"}
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b border-gray-200 bg-red-600 px-4 py-3 dark:border-neutral-800">
                            <span className="text-lg">🎬</span>
                            <div>
                                <p className="text-sm font-bold text-white">
                                    MovieBox Assistant
                                </p>
                                <p className="text-xs text-red-100">
                                    Ask me anything!
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-3 overflow-y-auto p-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={
                                        msg.role === "user"
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }
                                >
                                    <div
                                        className={
                                            msg.role === "user"
                                                ? "max-w-[80%] rounded-2xl rounded-br-sm bg-red-600 px-4 py-2 text-sm text-white"
                                                : "max-w-[80%] rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm text-gray-900 dark:bg-neutral-800 dark:text-neutral-100"
                                        }
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm dark:bg-neutral-800">
                                        <span className="flex gap-1">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-neutral-500" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.1s] dark:bg-neutral-500" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s] dark:bg-neutral-500" />
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-neutral-800">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-red-600 dark:border-neutral-700"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                ➤
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}