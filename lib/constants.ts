import { Wand2, Palette, Edit3, Building, Zap } from "lucide-react";

type GenerationOption = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  deploymentId: string;
  mode: string;
  credits: number;
  active: boolean;
  version: string;
};

export const generationOptions: GenerationOption[] = [
  {
    id: "sketch-to-furnish",
    name: "Sketch to Furnish",
    description:
      "Transform rough sketches into fully furnished interior designs",
    icon: Edit3,
    gradient: "from-blue-500 to-cyan-500",
    deploymentId: "0294186c-79bf-47a6-9dee-d250fc046623",
    mode: "interior",
    active: false,
    credits: 5,
    version: "v1",
  },
  {
    id: "style-transfer",
    name: "Style Transfer",
    description:
      "Apply different architectural styles to your existing designs",
    icon: Palette,
    gradient: "from-purple-500 to-pink-500",
    deploymentId: "f9b235f4-62c0-48e3-9c5a-7453429f3725",
    mode: "interior",
    active: true,
    credits: 5,
    version: "v1",
  },
  {
    id: "select-modify",
    name: "Select and Modify",
    description: "Select specific areas and modify them with AI precision",
    icon: Wand2,
    gradient: "from-emerald-500 to-teal-500",
    deploymentId: "f9b235f4-62c0-48e3-9c5a-7453429f3725",
    mode: "interior",
    active: true,
    credits: 5,
    version: "v1",
  },
  {
    id: "exterior-ai",
    name: "Exterior AI",
    description: "Generate stunning exterior architectural visualizations",
    icon: Building,
    gradient: "from-orange-500 to-red-500",
    deploymentId: "0294186c-79bf-47a6-9dee-d250fc046623",
    mode: "interior",
    active: true,
    credits: 5,
    version: "v1",
  },
  {
    id: "render-enhancer",
    name: "Render Enhancer",
    description: "Enhance existing renders with improved lighting and details",
    icon: Zap,
    gradient: "from-indigo-500 to-purple-500",
    deploymentId: "9a4dcc71-7d71-4067-8d18-6b9e08882135",
    mode: "enhancement",
    active: true,
    credits: 5,
    version: "v1",
  },
];
