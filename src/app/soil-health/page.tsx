
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FlaskConical, Loader2, Sparkles } from "lucide-react";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSoilHealthAndFertilizerGuidance,
  type SoilHealthAndFertilizerGuidanceOutput,
} from "@/ai/flows/soil-health-and-fertilizer-guidance";
import { VoiceSupportButton } from "@/components/voice-support-button";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  crop: z.string().min(2, "Crop name is required."),
  soilType: z.string({ required_error: "Please select a soil type." }),
});

export default function SoilHealthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<SoilHealthAndFertilizerGuidanceOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      crop: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const guidanceResult = await getSoilHealthAndFertilizerGuidance(values);
      setResult(guidanceResult);
    } catch (error) {
      console.error("Error getting soil health guidance:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl font-headline">Soil Health & Fertilizer Guide</h1>
          <p className="text-muted-foreground mt-2">
            Receive AI-generated recommendations for improving soil health and proper fertilizer use.
          </p>
        </div>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Guidance Details</CardTitle>
                <CardDescription>
                  Provide the following information for a detailed report.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (e.g., city, state)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="e.g., Pune, Maharashtra" {...field} />
                          <VoiceSupportButton onClick={() => console.log('Voice input for location')} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input placeholder="e.g., Sugarcane" {...field} />
                             <VoiceSupportButton onClick={() => console.log('Voice input for crop')} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Alluvial">Alluvial</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Red">Red</SelectItem>
                          <SelectItem value="Laterite">Laterite</SelectItem>
                          <SelectItem value="Desert">Desert</SelectItem>
                          <SelectItem value="Mountain">Mountain</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FlaskConical className="mr-2 h-4 w-4" />
                  )}
                  Get Guidance
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {loading && (
          <Card className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Our AI is preparing your soil report...
            </p>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent" />
                Your AI-Generated Soil Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Soil Health Recommendations</h3>
                <div className="prose dark:prose-invert max-w-none mt-2 rounded-md border bg-muted/50 p-4">
                  <p>{result.soilHealthRecommendations}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Fertilizer Guidance</h3>
                <div className="prose dark:prose-invert max-w-none mt-2 rounded-md border bg-muted/50 p-4">
                  <p>{result.fertilizerGuidance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
