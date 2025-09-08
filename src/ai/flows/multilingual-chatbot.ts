'use server';
/**
 * @fileOverview A multilingual AI chatbot for agricultural advice.
 *
 * - multilingualChatbot - A function that provides answers to user queries in multiple languages.
 * - MultilingualChatbotInput - The input type for the multilingualChatbot function.
 * - MultilingualChatbotOutput - The return type for the multilingualChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualChatbotInputSchema = z.object({
  message: z.string().describe("The user\'s message or question."),
  language: z
    .string()
    .describe('The language in which to respond.'),
});
export type MultilingualChatbotInput = z.infer<
  typeof MultilingualChatbotInputSchema
>;

const MultilingualChatbotOutputSchema = z.object({
  response: z.string().describe("The AI\'s response to the user\'s message."),
});
export type MultilingualChatbotOutput = z.infer<
  typeof MultilingualChatbotOutputSchema
>;

export async function multilingualChatbot(
  input: MultilingualChatbotInput
): Promise<MultilingualChatbotOutput> {
  return multilingualChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualChatbotPrompt',
  input: {schema: MultilingualChatbotInputSchema},
  output: {schema: MultilingualChatbotOutputSchema},
  prompt: `You are AgriBot, a friendly and knowledgeable AI assistant for farmers. Your goal is to provide helpful and accurate information about farming, crops, pests, and soil management.

A user has sent the following message. Respond to them in a helpful and conversational manner in the specified language.

Language: {{{language}}}
Message: {{{message}}}
`,
});

const multilingualChatbotFlow = ai.defineFlow(
  {
    name: 'multilingualChatbotFlow',
    inputSchema: MultilingualChatbotInputSchema,
    outputSchema: MultilingualChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
