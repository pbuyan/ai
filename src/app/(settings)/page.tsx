import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Database,
  Sparkles,
  MessageCircleHeart,
  Gauge,
  GaugeCircle,
  Languages,
  Globe,
  Brain,
  BrainCircuit,
  BrainCog,
} from "lucide-react";
import { Terminal } from "./terminal";

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Powered Dialogues",
    description:
      "Practice conversations with AI-powered virtual assistants, enabling you to learn new languages and improve your communication skills.",
  },
  {
    icon: <Languages className="h-6 w-6" />,
    title: "Translation Support",
    description:
      "Instantly translate dialogues to understand nuances and expand vocabulary.",
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "Customizable Practice",
    description:
      "Select topics, languages, and difficulty levels to suit your learning goals.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Master Foreign Languages
                <span className="block text-destructive">
                  Through AI-Powered Dialogues
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Choose your topic, language, and difficulty level to practice
                communication skills like never before.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a href="/sign-up">
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Get Started For Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-10 text-center">Features</h3>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <Card className="mb-8" key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex gap-4 align-middle">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-destructive text-white">
                      {feature.icon}
                    </div>
                    <div className="my-auto">{feature.title}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <p className="mt-2 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-10 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-destructive text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                1
              </div>
              <h4 className="text-2xl font-bold mb-4">Choose Your Settings</h4>
              <p>
                Select the topic, language, and difficulty level for your
                dialogue.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-destructive text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                2
              </div>
              <h4 className="text-2xl font-bold mb-4">
                Engage in Conversations
              </h4>
              <p>
                Practice with AI-generated dialogues designed to simulate real
                interactions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-destructive text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                3
              </div>
              <h4 className="text-2xl font-bold mb-4">Translate and Review</h4>
              <p>
                Generate translations and refine your skills with instant
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to launch your SaaS?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Our template provides everything you need to get your SaaS up
                and running quickly. Don't waste time on boilerplate - focus on
                what makes your product unique.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a
                href="https://github.com/leerob/next-saas-starter"
                target="_blank"
              >
                <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  View the code
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
