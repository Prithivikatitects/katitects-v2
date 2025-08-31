"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { ImageMaskingTool } from "@/components/image-masking-tool";
import {
  runComfyDeployWorkflow,
  consumeCredits,
  getPublicUrl,
} from "@/services/supabase-workflow-api";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Wand2,
  Palette,
  Edit3,
  Building,
  Zap,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { generationOptions } from "@/lib/constants";
import ScandinavianPreview from "@/public/images/workflow-1.webp";
import ParisianPreview from "@/public/images/workflow-2.webp";
import EclecticPreview from "@/public/images/workflow-3.jpeg";
import ContemporaryPreview from "@/public/images/workflow-4.jpeg";
import FuturisticPreview from "@/public/images/workflow-5.jpg";
import MinimalistPreview from "@/public/images/workflow-6.jpeg";
import JapandiPreview from "@/public/images/workflow-7.jpeg";
import BohemianPreview from "@/public/images/workflow-8.jpg";
import IndianPreview from "@/public/images/workflow-9.webp";
import { enhancePrompt } from "@/services/prompt-enhance-service";

type StyleOption = {
  id: string;
  name: string;
  description: string;
  preview: string;
};

const styleOptions: StyleOption[] = [
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light woods, cozy textures, and functional design",
    preview: ScandinavianPreview.src,
  },
  {
    id: "parisian",
    name: "Parisian",
    description: "Classic French elegance with ornate details",
    preview: ParisianPreview.src,
  },
  {
    id: "eclectic",
    name: "Eclectic",
    description: "Bold mix of colors, patterns, and diverse elements",
    preview: EclecticPreview.src,
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Clean lines and modern aesthetics",
    preview: ContemporaryPreview.src,
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "Cutting-edge design with advanced materials",
    preview: FuturisticPreview.src,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple, uncluttered spaces with essential elements",
    preview: MinimalistPreview.src,
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Japanese minimalism meets Scandinavian warmth",
    preview: JapandiPreview.src,
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Free-spirited with rich textures and vibrant colors",
    preview: BohemianPreview.src,
  },
  {
    id: "indian",
    name: "Indian",
    description: "Rich cultural heritage with intricate patterns",
    preview: IndianPreview.src,
  },
];

export default function WorkflowsPage() {
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [inputCheckpoint, setInputCheckpoint] = useState<string>("");
  const [uploadedMaskUrl, setUploadedMaskUrl] = useState<string>("");
  const [showMaskingTool, setShowMaskingTool] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // show temporary preview
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);
      setUploadedImage(file);

      // 🔹 Upload to Supabase
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("uploaded-images") // 👈 bucket name
        .upload(fileName, file);

      if (error) throw error;

      // 🔹 Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("uploaded-images").getPublicUrl(data.path);

      // Save for later usage
      setUploadedImageUrl(publicUrl);

      // cleanup object URL when not needed anymore
      return () => URL.revokeObjectURL(localPreview);
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  const handlePromptEnhance = async () => {
    setIsEnhancingPrompt(true);

    const enhancedPrompt = await enhancePrompt(
      prompt,
      uploadedImageUrl,
      selectedStyle,
      "interior",
      uploadedMaskUrl
    );
    console.log("Enhanced Prompt:", enhancedPrompt);

    setPrompt(enhancedPrompt);
    setIsEnhancingPrompt(false);
  };

  const handleGenerate = async () => {
    try {
      // Determine workflow deployment ID first
      const selectedWorkflow = generationOptions.find(
        (opt) => opt.id === selectedGeneration
      );
      const workflowDeploymentId = uploadedMaskUrl
        ? "f9b235f4-62c0-48e3-9c5a-7453429f3725" // Masked Sketch To Furnish
        : selectedWorkflow?.deploymentId || "";

      if (!workflowDeploymentId) {
        throw new Error(
          "No valid deployment ID found for the selected workflow"
        );
      }

      const apiInputs: any = {
        input_image: uploadedImageUrl,
        positive: prompt,
        input_checkpoint: inputCheckpoint,
        workflow_id: workflowDeploymentId,
        version: "1.0",
        batch_number: 1,
      };

      if (uploadedMaskUrl) {
        apiInputs.input_mask = uploadedMaskUrl;
      }

      setIsGenerating(true);
      setProgress(0);

      // Get current user and check credits
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error("Failed to authenticate user");
      console.log(user, "user");

      // Check and consume credits before generation
      const requiredCredits = 1;
      await consumeCredits(user?.id, requiredCredits);

      const outputs = await runComfyDeployWorkflow(
        workflowDeploymentId,
        apiInputs,
        (progress: any, status: any) => {
          setProgress(progress * 100);
        }
      );

      if (outputs && outputs.length > 0) {
        const generatedImageUrls = outputs.flatMap((outputItem: any) => {
          if (
            outputItem?.data?.images &&
            Array.isArray(outputItem.data.images)
          ) {
            return outputItem.data.images.map((image: any) => image.url);
          }
          return [];
        });

        console.log("Generated image URLs:", generatedImageUrls);

        // Save the first generated image to Supabase
        if (generatedImageUrls.length > 0) {
          const imageUrl = generatedImageUrls[0];
          const response = await fetch(imageUrl);
          const blob = await response.blob();

          const fileName = `generated-${Date.now()}.png`;
          const { data, error } = await supabase.storage
            .from("generated-images")
            .upload(fileName, blob);

          if (error) throw error;

          const publicUrl = getPublicUrl("generated-images", fileName);
          setGeneratedImage(publicUrl);

          // Save to images table in Supabase
          const imageData = {
            url: publicUrl,
            prompt: prompt,
            user_id: user?.id,
            original_image_url: uploadedImageUrl,
            negative_prompt: negativePrompt,
            style: selectedStyle,
            checkpoint: inputCheckpoint,
            workflow_mode: selectedWorkflow?.id,
            workflow_title: selectedWorkflow?.name,
            workflow_version: "1.0",
          };

          const { error: dbError } = await supabase
            .from("images")
            .insert([imageData]);

          if (dbError) throw dbError;
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(error.message || "An error occurred during generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate =
    selectedGeneration && selectedStyle && uploadedImage && prompt.trim();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mt-2 text-2xl font-bold">AI Workflows</h1>
          <p className="text-muted-foreground">
            Create stunning designs with AI-powered tools
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Generation Option */}
            <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  1. Choose Generation Type
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select how you want to generate your design
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {generationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGeneration(option.id)}
                    className={`group glass-hover relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                      selectedGeneration === option.id
                        ? "border-purple-500/50 bg-purple-500/10 ring-1 ring-purple-500/30"
                        : "border-border/60 hover:border-border"
                    }`}
                  >
                    <div
                      className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-white bg-gradient-to-br ${option.gradient}`}
                    >
                      <option.icon />
                    </div>
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>

                    {/* Shine effect */}
                    <div className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-xl bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: Style Selection */}
            <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">2. Select Style</h2>
                <p className="text-sm text-muted-foreground">
                  Choose the aesthetic style for your design
                </p>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {styleOptions.map((style, index) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] animate-fade-in ${
                      selectedStyle === style.id
                        ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/30"
                        : "border-border/40 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5"
                    }`}
                  >
                    {/* Background Image */}
                    <div className="relative h-32 overflow-hidden rounded-t-2xl">
                      <Image
                        src={style.preview || "/placeholder.svg"}
                        alt={style.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Selection indicator */}
                      {selectedStyle === style.id && (
                        <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg">
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-purple-600/5 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {style.name}
                        </h3>
                        {/* Style icon based on name */}
                        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                          {style.name === "Scandinavian" && (
                            <span className="text-lg">⭐</span>
                          )}
                          {style.name === "Parisian" && (
                            <span className="text-lg">🏛️</span>
                          )}
                          {style.name === "Eclectic" && (
                            <span className="text-lg">🎨</span>
                          )}
                          {style.name === "Contemporary" && (
                            <span className="text-lg">🏢</span>
                          )}
                          {style.name === "Futuristic" && (
                            <span className="text-lg">🚀</span>
                          )}
                          {style.name === "Minimalist" && (
                            <span className="text-lg">⬜</span>
                          )}
                          {style.name === "Japandi" && (
                            <span className="text-lg">🌿</span>
                          )}
                          {style.name === "Bohemian" && (
                            <span className="text-lg">🌺</span>
                          )}
                          {style.name === "Indian" && (
                            <span className="text-lg">🕌</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                        {style.description}
                      </p>

                      {/* Progress bar for selected state */}
                      {selectedStyle === style.id && (
                        <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm" />
                      )}
                    </div>

                    {/* Enhanced shine effect */}
                    <div className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-2xl bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.15),transparent)] transition-transform duration-1000 group-hover:translate-x-[120%]" />

                    {/* Subtle border glow */}
                    <div
                      className={`pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-sm transition-opacity duration-500 ${
                        selectedStyle === style.id
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30"
                          : "group-hover:opacity-20 bg-gradient-to-r from-purple-500/50 to-indigo-500/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Selected style info */}
              {selectedStyle && (
                <div className="mt-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Selected:{" "}
                        <span className="text-purple-600 dark:text-purple-400">
                          {
                            styleOptions.find((s) => s.id === selectedStyle)
                              ?.name
                          }
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {
                          styleOptions.find((s) => s.id === selectedStyle)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Step 3: Image Upload */}
            <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">3. Upload Image</h2>
                <p className="text-sm text-muted-foreground">
                  Upload your sketch, photo, or design reference
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="glass-hover group relative overflow-hidden rounded-xl border-2 border-dashed border-border/60 p-8 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                    <p className="mt-2 text-sm font-medium">
                      Click to upload image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview && (
                  <div className="relative h-48 overflow-hidden rounded-xl border border-border/60">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Uploaded image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Step 3.5: Masking Tool (conditional) */}
            {imagePreview && selectedGeneration === "select-modify" && (
              <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">3.5. Create Mask</h2>
                  <p className="text-sm text-muted-foreground">
                    Paint the areas you want to modify with AI
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => setShowMaskingTool(!showMaskingTool)}
                    variant="outline"
                    className="glass-hover bg-transparent"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {showMaskingTool
                      ? "Hide Masking Tool"
                      : "Show Masking Tool"}
                  </Button>

                  {showMaskingTool && (
                    <ImageMaskingTool
                      imageUrl={imagePreview}
                      onMaskGenerated={async (maskDataUrl: any) => {
                        if (maskDataUrl) {
                          // Convert data URL to blob and upload to Supabase
                          const response = await fetch(maskDataUrl);
                          const blob = await response.blob();

                          const fileName = `mask-${Date.now()}.png`;
                          const { data, error } = await supabase.storage
                            .from("uploaded-images")
                            .upload(fileName, blob);

                          if (!error) {
                            const publicUrl = getPublicUrl(
                              "uploaded-images",
                              fileName
                            );
                            setUploadedMaskUrl(publicUrl);
                          }
                        } else {
                          setUploadedMaskUrl("");
                        }
                      }}
                    />
                  )}

                  {uploadedMaskUrl && (
                    <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium">
                          ✓
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            Mask created successfully
                          </p>
                          <p className="text-xs text-muted-foreground">
                            White areas will be modified by AI
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Step 4: Prompt */}
            <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  4. Describe Your Vision
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell the AI what you want to create or modify
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your vision... e.g., 'Transform this sketch into a modern living room with large windows, comfortable seating, and warm lighting'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="glass-hover min-h-[100px] resize-none placeholder:text-muted-foreground/70"
                  />
                </div>

                <Button
                  onClick={handlePromptEnhance}
                  disabled={!prompt.trim() || isGenerating}
                  variant="outline"
                  size="sm"
                  className="glass-hover bg-transparent"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isEnhancingPrompt ? "Enhancing..." : "Enhance Prompt"}
                </Button>
              </div>
            </section>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              size="lg"
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Design
                </>
              )}
              <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
            </Button>
          </div>

          {/* Right Column - Preview/Result */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <section className="glass-hover rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Preview</h2>

                {isGenerating ? (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-500" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Generating your design... {Math.round(progress)}%
                      </p>
                      <div className="mt-2 w-32 h-2 bg-muted/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative h-64 overflow-hidden rounded-xl border border-border/60">
                      <Image
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated design"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownload}
                        size="sm"
                        variant="outline"
                        className="flex-1 glass-hover bg-transparent"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass-hover bg-transparent"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your generated design will appear here
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Indicators */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {
                        [
                          selectedGeneration,
                          selectedStyle,
                          uploadedImage,
                          prompt.trim(),
                        ].filter(Boolean).length
                      }
                      /4
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                      style={{
                        width: `${
                          ([
                            selectedGeneration,
                            selectedStyle,
                            uploadedImage,
                            prompt.trim(),
                          ].filter(Boolean).length /
                            4) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
