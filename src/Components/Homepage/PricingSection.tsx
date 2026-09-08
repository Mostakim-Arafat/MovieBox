"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Plan = {
    id: string;
    name: string;
    price: number;
    quality: string;
    resolution: string;
    devices: string;
    screens: number;
    popular?: boolean;
};

const plans: Plan[] = [
    {
        id: "mobile",
        name: "Mobile",
        price: 2.99,
        quality: "Fair",
        resolution: "480p",
        devices: "Mobile, Tablet",
        screens: 1,
    },
    {
        id: "basic",
        name: "Basic",
        price: 3.99,
        quality: "Good",
        resolution: "720p HD",
        devices: "TV, Computer, Mobile",
        screens: 1,
    },
    {
        id: "standard",
        name: "Standard",
        price: 7.99,
        quality: "Great",
        resolution: "1080p Full HD",
        devices: "TV, Computer, Mobile, Tablet",
        screens: 2,
    },
    {
        id: "premium",
        name: "Premium",
        price: 9.99,
        quality: "Best",
        resolution: "4K + HDR",
        devices: "All Devices",
        screens: 4,
        popular: true,
    },
];

export default function PricingSection() {
    const [selected, setSelected] = useState("premium");
    const [loading,setLoading] = useState(false)
    const router = useRouter()
    const { data } = authClient.useSession()
    const user = data?.user
   
    const currentPlan = plans.find( p => p.id === selected)

    const handlepayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentPlan?.price,
          name: user?.name,
          email: user?.email,
          phone: '01811223344',
          productName: currentPlan?.name
        }),
      });

      const data = await res.json();

      console.log(data)

      if (data.gatewayUrl) {
       
        window.location.href = data.gatewayUrl;
      } else {
        alert('Could not initialize payment.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

    return (
        <section className="w-full bg-gray-50 px-4 py-16 text-gray-900 sm:px-8 lg:px-12 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center"
                >
                    <span className="mb-3 inline-block rounded-full bg-red-600/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
                        Membership
                    </span>
                    <h2 className="text-3xl font-black sm:text-4xl">
                        Choose your plan
                    </h2>
                    <p className="mt-3 text-gray-500 dark:text-neutral-400">
                        Watch anywhere. Cancel anytime. No hidden fees.
                    </p>
                </motion.div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan, index) => {
                        const isSelected = selected === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ y: -6 }}
                                onClick={() => setSelected(plan.id)}
                                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 transition-colors ${isSelected
                                        ? "border-red-600 bg-white dark:bg-neutral-900"
                                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute right-0 top-0 rounded-bl-lg bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                        Most Popular
                                    </span>
                                )}

                                <h3 className="text-xl font-bold">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                                    {plan.resolution}
                                </p>

                                <div className="mt-5">
                                    <span className="text-3xl font-black">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-neutral-500">
                                        {" "}
                                        / month
                                    </span>
                                </div>

                                <ul className="mt-6 space-y-3 text-sm text-gray-700 dark:text-neutral-300">
                                    <li className="flex justify-between border-b border-gray-200 pb-2 dark:border-neutral-800">
                                        <span className="text-gray-500 dark:text-neutral-500">
                                            Quality
                                        </span>
                                        <span className="font-medium">
                                            {plan.quality}
                                        </span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-200 pb-2 dark:border-neutral-800">
                                        <span className="text-gray-500 dark:text-neutral-500">
                                            Devices
                                        </span>
                                        <span className="text-right font-medium">
                                            {plan.devices}
                                        </span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500 dark:text-neutral-500">
                                            Screens
                                        </span>
                                        <span className="font-medium">
                                            {plan.screens}
                                        </span>
                                    </li>
                                </ul>

                                <motion.div
                                    animate={{
                                        scale: isSelected ? 1 : 0.9,
                                        opacity: isSelected ? 1 : 0,
                                    }}
                                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white"
                                >
                                    ✓ Selected
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

               
                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlepayment}
                    className="mx-auto mt-10 block w-full max-w-xs rounded-lg bg-red-600 py-3.5 font-bold text-white transition hover:bg-red-700"
                >
                   {loading ? "processing......." : "Continue"} 
                </motion.button>
               
            </div>
        </section>
    );
}