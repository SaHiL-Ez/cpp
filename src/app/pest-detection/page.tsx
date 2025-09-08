"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Loader2, ScanEye, Sparkles, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  detectPestDisease,
  type DetectPestDiseaseOutput,
} from "@/ai/flows/pest-disease-detection";
import { useToast } from "@/hooks/use-toast";

export default function PestDetectionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectPestDiseaseOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image file (e.g., JPG, PNG).",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        setDataUri(dataUrl);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!dataUri) return;

    setLoading(true);
    setResult(null);
    try {
      const detectionResult = await detectPestDisease({ photoDataUri: dataUri });
      setResult(detectionResult);
    } catch (error) {
      console.error("Error detecting pest/disease:", error);
       toast({
          variant: "destructive",
          title: "Detection Failed",
          description: "Could not analyze the image. Please try again.",
        });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setDataUri(null);
    setResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold md:text-4xl font-headline">Pest & Disease Detection</h1>
            <p className="text-muted-foreground mt-2">
                Upload a photo of your crop to instantly identify potential pests and diseases.
            </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>
              For best results, use a clear, close-up image of the affected area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Crop preview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={(e) => {e.stopPropagation(); handleRemoveImage();}}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={!dataUri || loading}
              onClick={handleDetect}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ScanEye className="mr-2 h-4 w-4" />
              )}
              Detect Pest/Disease
            </Button>
          </CardFooter>
        </Card>

        {loading && (
          <Card className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is scanning your image...</p>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent" />
                Detection Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`rounded-lg p-4 ${result.detected ? 'bg-destructive/10 border-destructive' : 'bg-green-500/10 border-green-500'} border`}>
                <h3 className="font-semibold text-lg">{result.detected ? `Issue Detected: ${result.PestOrDisease}` : "No Pest or Disease Detected"}</h3>
                <p className="text-sm text-muted-foreground">{result.detected ? "An issue has been identified in your crop." : "Your crop appears healthy based on the image."}</p>
              </div>

              {result.detected && (
                <>
                <div>
                    <Label>Confidence Score</Label>
                    <div className="flex items-center gap-2 mt-1">
                        <Progress value={result.confidence * 100} className="w-full" />
                        <span className="font-semibold text-sm">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Recommendations</h3>
                    <div className="prose dark:prose-invert max-w-none mt-2 rounded-md border bg-muted/50 p-4">
                    <p>{result.recommendations}</p>
                    </div>
              </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
