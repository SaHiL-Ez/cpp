
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Languages, Loader2, Sparkles } from "lucide-react";

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
  multilingualAICropAdvisory,
  type MultilingualAICropAdvisoryOutput,
} from "@/ai/flows/multilingual-ai-crop-advisory";
import { VoiceSupportButton } from "@/components/voice-support-button";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
  crop: z.string().min(2, "Crop name is required."),
  language: z.string({ required_error: "Please select a language." }),
});

export default function CropAdvisoryPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MultilingualAICropAdvisoryOutput | null>(
    null
  );

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
      const advisoryResult = await multilingualAICropAdvisory(values);
      setResult(advisoryResult);
    } catch (error) {
      console.error("Error getting crop advisory:", error);
      // You can add toast notifications here for errors
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold md:text-4xl font-headline">AI Crop Advisory</h1>
            <p className="text-muted-foreground mt-2">
                Enter your details to receive personalized, AI-powered crop advice in your preferred language.
            </p>
        </div>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Advisory Details</CardTitle>
                <CardDescription>
                  Fill in the fields below to get your report.
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
                          <Input placeholder="e.g., Nashik, Maharashtra" {...field} />
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
                            <Input placeholder="e.g., Grapes" {...field} />
                            <VoiceSupportButton onClick={() => console.log('Voice input for crop')} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
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
                    <Languages className="mr-2 h-4 w-4" />
                  )}
                  Get Advice
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {loading && (
          <Card className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              Our AI is analyzing the best advice for you...
            </p>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent" />
                Your AI-Generated Crop Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none rounded-md border bg-muted/50 p-4">
                <p>{result.advice}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
