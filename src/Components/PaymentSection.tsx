"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PaymentMethod = {
    id: string;
    label: string;
    icon: string;
    sub?: string;
};

const methods: PaymentMethod[] = [
    { id: "card", label: "Credit or Debit Card", icon: "💳", sub: "Visa, Mastercard" },
    { id: "mobile", label: "Mobile Banking", icon: "📱", sub: "bKash, Nagad, Rocket" },
    { id: "paypal", label: "PayPal", icon: "🅿️" },
];

export default function PaymentSection() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <section className="w-full bg-white px-4 py-16 text-gray-900 sm:px-8 lg:px-12 dark:bg-neutral-950 dark:text-white">
            <div className="mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/10 text-2xl">
                        🔒
                    </div>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Secure payment
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        Your payment info is encrypted. Cancel or change
                        anytime.
                    </p>
                </motion.div>

                <div className="space-y-3">
                    {methods.map((method, index) => {
                        const isOpen = selected === method.id;
                        return (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                }}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-black"
                            >
                                <button
                                    onClick={() =>
                                        setSelected(isOpen ? null : method.id)
                                    }
                                    className="flex w-full items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {method.icon}
                                        </span>
                                        <div>
                                            <p className="font-semibold">
                                                {method.label}
                                            </p>
                                            {method.sub && (
                                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                                    {method.sub}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-gray-400 dark:text-neutral-500"
                                    >
                                        ›
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="border-t border-gray-200 px-5 pb-5 pt-4 dark:border-neutral-800"
                                        >
                                            <p className="mb-3 text-xs text-gray-500 dark:text-neutral-500">
                                                Demo only — payment fields
                                                will connect to the API later.
                                            </p>
                                            <div className="space-y-3">
                                                <input
                                                    placeholder="Card number"
                                                    disabled
                                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600"
                                                />
                                                <div className="flex gap-3">
                                                    <input
                                                        placeholder="MM/YY"
                                                        disabled
                                                        className="w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600"
                                                    />
                                                    <input
                                                        placeholder="CVV"
                                                        disabled
                                                        className="w-1/2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-neutral-600"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!selected}
                    className="mt-8 w-full rounded-lg bg-red-600 py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Start Membership
                </motion.button>
            </div>
        </section>
    );
}