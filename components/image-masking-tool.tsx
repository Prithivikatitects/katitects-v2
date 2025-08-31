"use client";

import type React from "react";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Undo2, RotateCcw, Download } from "lucide-react";

interface ImageMaskingToolProps {
  imageUrl: string;
  onMaskGenerated: (maskDataUrl: string) => void;
  className?: string;
}

export function ImageMaskingTool({
  imageUrl,
  onMaskGenerated,
  className,
}: ImageMaskingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas || !imageUrl) return;

    const ctx = canvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");
    if (!ctx || !maskCtx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas dimensions to match image
      const maxWidth = 512;
      const maxHeight = 512;
      let { width, height } = img;

      // Scale down if too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;

      // Draw image on main canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Initialize mask canvas with black background
      maskCtx.fillStyle = "black";
      maskCtx.fillRect(0, 0, width, height);

      setImageLoaded(true);
      saveToHistory(maskCtx);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const saveToHistory = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        return newHistory.slice(-10); // Keep only last 10 states
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 9));
    },
    [historyIndex]
  );

  const getMousePos = useCallback(
    (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas || !imageLoaded) return;

      setIsDrawing(true);
      const pos = getMousePos(maskCanvas, e);
      const ctx = maskCanvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    },
    [brushSize, imageLoaded, getMousePos]
  );

  const draw = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;

      const pos = getMousePos(maskCanvas, e);
      const ctx = maskCanvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    },
    [isDrawing, brushSize, getMousePos]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    saveToHistory(ctx);

    // Generate mask data URL and call callback
    const maskDataUrl = maskCanvas.toDataURL("image/png");
    onMaskGenerated(maskDataUrl);
  }, [isDrawing, onMaskGenerated, saveToHistory]);

  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    saveToHistory(ctx);
    onMaskGenerated("");
  }, [onMaskGenerated, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    const prevImageData = history[historyIndex - 1];
    ctx.putImageData(prevImageData, 0, 0);
    setHistoryIndex((prev) => prev - 1);

    const maskDataUrl = maskCanvas.toDataURL("image/png");
    onMaskGenerated(maskDataUrl);
  }, [history, historyIndex, onMaskGenerated]);

  const downloadMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const link = document.createElement("a");
    link.download = "mask.png";
    link.href = maskCanvas.toDataURL();
    link.click();
  }, []);

  if (!imageLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-xl">
        <p className="text-muted-foreground">Loading image...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="brush-size" className="text-sm">
              Brush Size:
            </Label>
            <Slider
              id="brush-size"
              min={5}
              max={50}
              step={1}
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground w-8">
              {brushSize}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="glass-hover bg-transparent"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearMask}
            className="glass-hover bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadMask}
            className="glass-hover bg-transparent"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative rounded-xl border border-border/60 overflow-hidden bg-checkered">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ maxHeight: "400px" }}
        />
        <canvas
          ref={maskCanvasRef}
          className="absolute inset-0 w-full h-full object-contain opacity-50 cursor-crosshair"
          style={{ maxHeight: "400px", mixBlendMode: "multiply" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          <strong>Instructions:</strong> Click and drag to paint white areas on
          the mask. White areas will be modified by AI.
        </p>
      </div>

      {/* Checkered background style */}
      <style jsx>{`
        .bg-checkered {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .dark .bg-checkered {
          background-image: linear-gradient(45deg, #404040 25%, transparent 25%),
            linear-gradient(-45deg, #404040 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #404040 75%),
            linear-gradient(-45deg, transparent 75%, #404040 75%);
        }
      `}</style>
    </div>
  );
}
