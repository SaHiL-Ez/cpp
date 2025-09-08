"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Loader2, Send, Sparkles, User, Volume2 } from "lucide-react";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  multilingualChatbot,
} from "@/ai/flows/multilingual-chatbot";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiChatbotPage() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState("English");
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [speakingMessage, setSpeakingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
    useEffect(() => {
    if (audioPlayer) {
      const handleAudioEnd = () => setSpeakingMessage(null);
      audioPlayer.addEventListener('ended', handleAudioEnd);
      return () => {
        audioPlayer.removeEventListener('ended', handleAudioEnd);
      };
    }
  }, [audioPlayer]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const userMessage: Message = { role: "user", content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await multilingualChatbot({
        message: values.message,
        language: language,
      });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSpeak = async (text: string) => {
    if (speakingMessage === text) {
        audioPlayer?.pause();
        setSpeakingMessage(null);
        return;
    }
    
    setSpeakingMessage(text);
    try {
      const result = await textToSpeech(text);
      const audio = new Audio(result.audioDataUri);
      setAudioPlayer(audio);
      audio.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Could not generate audio for this message.',
      });
      setSpeakingMessage(null);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl font-headline">
            AI Chatbot
          </h1>
          <p className="text-muted-foreground mt-2">
            Ask me anything about farming. I'm here to help!
          </p>
        </div>
        <Card className="flex flex-col h-[70vh]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                 <Sparkles className="text-accent h-6 w-6" />
                 <CardTitle>AgriBot</CardTitle>
            </div>
            <div className="w-48">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Marathi">Marathi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 group ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] relative ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                   {message.role === 'assistant' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -right-11 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                      onClick={() => handleSpeak(message.content)}
                    >
                      {speakingMessage === message.content ? <Loader2 className="h-4 w-4 animate-spin"/> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {loading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type your message..."
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon" disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
