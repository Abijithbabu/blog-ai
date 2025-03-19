"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Spotlight } from "../components/ui/spotlight";
import { Meteors } from "../components/ui/meteors";
import {
  Bot,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart,
  Globe,
  Layers,
  Palette,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Navbar } from "../components/ui/navbar";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Advanced AI Writing",
    description:
      "State-of-the-art language model trained on high-performing content",
    benefits: [
      "Natural language generation",
      "Context-aware content",
      "Multi-language support",
    ],
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "SEO Optimization",
    description: "Built-in SEO tools to ensure your content ranks higher",
    benefits: ["Keyword optimization", "Meta tag generation", "Schema markup"],
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-Platform Publishing",
    description: "Seamlessly publish to all major platforms",
    benefits: [
      "WordPress integration",
      "Medium support",
      "Social media scheduling",
    ],
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Content Strategy",
    description: "AI-powered content planning and optimization",
    benefits: ["Topic clustering", "Content calendar", "Performance tracking"],
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Brand Voice",
    description: "Maintain consistent brand voice across all content",
    benefits: ["Voice training", "Style guides", "Tone adjustment"],
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Plagiarism Protection",
    description: "Ensure your content is 100% original",
    benefits: ["Real-time checking", "Source citation", "Uniqueness score"],
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "29",
    features: [
      "10 AI-generated posts/month",
      "Basic SEO optimization",
      "Email support",
      "1 user seat",
      "Content calendar",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "79",
    features: [
      "30 AI-generated posts/month",
      "Advanced SEO tools",
      "Priority support",
      "3 user seats",
      "Custom templates",
      "Advanced analytics",
      "API access",
      "Plagiarism checker",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "199",
    features: [
      "Unlimited posts",
      "Custom AI training",
      "Dedicated manager",
      "Unlimited seats",
      "Custom integrations",
      "White-label options",
      "Advanced API access",
      "Custom features",
    ],
    popular: false,
  },
];

const stats = [
  {
    number: "2M+",
    label: "Blog Posts Generated",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    number: "50K+",
    label: "Active Users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    number: "98%",
    label: "Satisfaction Rate",
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

function LandingPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Spotlight className="top-0 left-0" fill="white" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/30 text-xs font-medium bg-white/10 backdrop-blur-sm"
          >
            <span className="mr-2">🎉</span> Trusted by 50,000+ content creators
            worldwide
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          >
            Transform Your Content Creation with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Create SEO-optimized, engaging blog posts in minutes. Let AI handle
            the writing while you focus on strategy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push("/signup")}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              Watch Demo <Sparkles className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
        <Meteors number={20} />
      </div>

      {/* Stats Section */}
      <div className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-lg bg-white/10">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-500">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-4"
            >
              Everything You Need for Modern Content Creation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Powerful features designed to help you create, optimize, and scale
              your content strategy
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-4"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Choose the perfect plan for your content needs
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={cn(
                  "p-8 rounded-2xl relative",
                  tier.popular
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400"
                    : "bg-white/5 border border-white/10"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
                <div className="text-3xl font-bold mb-6">
                  ${tier.price}
                  <span className="text-base font-normal text-gray-400">
                    /mo
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2
                        className={cn(
                          "h-5 w-5",
                          tier.popular ? "text-blue-300" : "text-green-500"
                        )}
                      />
                      <span
                        className={
                          tier.popular ? "text-white" : "text-gray-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push("/signup")}
                  className={cn(
                    "w-full py-3 rounded-lg font-semibold transition-colors text-sm",
                    tier.popular
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  Start Free Trial
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Start Creating Better Content Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Join 50,000+ content creators who are already using BlogAI to
            transform their content strategy
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-3/5 px-6 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm"
            />
            <button
              onClick={() => router.push("/signup")}
              className="w-full md:w-2/5 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
        <Meteors number={10} />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 BlogAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
