'use server';
/**
 * @fileOverview A multilingual AI crop advisory flow.
 *
 * - multilingualAICropAdvisory - A function that provides location-specific crop advice in multiple languages using AI.
 * - MultilingualAICropAdvisoryInput - The input type for the multilingualAICropAdvisory function.
 * - MultilingualAICropAdvisoryOutput - The return type for the multilingualAICropAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualAICropAdvisoryInputSchema = z.object({
  location: z
    .string()
    .describe("The farmer's current location (e.g., city, state)."),
  crop: z.string().describe('The type of crop the farmer is growing.'),
  language: z
    .string()
    .describe('The language in which to provide the crop advice.'),
});
export type MultilingualAICropAdvisoryInput = z.infer<
  typeof MultilingualAICropAdvisoryInputSchema
>;

const MultilingualAICropAdvisoryOutputSchema = z.object({
  advice: z.string().describe('The crop advice in the specified language.'),
});
export type MultilingualAICropAdvisoryOutput = z.infer<
  typeof MultilingualAICropAdvisoryOutputSchema
>;

export async function multilingualAICropAdvisory(
  input: MultilingualAICropAdvisoryInput
): Promise<MultilingualAICropAdvisoryOutput> {
  return multilingualAICropAdvisoryFlow(input);
}

const weatherTool = ai.defineTool({
  name: 'getWeather',
  description: 'Get the current and predicted weather for a location.',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for.'),
  }),
  outputSchema: z.object({
    currentWeather: z.string().describe('The current weather conditions.'),
    predictedWeather: z
      .string()
      .describe('The predicted weather conditions for the next few days.'),
  }),
  fn: async (input) => {
    const locations = ['nashik', 'pune', 'kolhapur', 'solapur', 'jalgaon', 'latur', 'nagpur'];
    const location = input.location.toLowerCase();
    
    let temp = 25 + Math.floor(Math.random() * 10) - 5;
    let condition = 'Sunny';
    const predictions = ['Mostly sunny', 'Chance of rain', 'Cloudy with sunny spells', 'Risk of thunderstorms'];
    let prediction = predictions[Math.floor(Math.random() * predictions.length)];

    if (locations.some(l => location.includes(l))) {
      // Simulate slightly different weather for different known locations
      const index = locations.findIndex(l => location.includes(l));
      temp += (index % 4) - 2; // -2 to +1 variation
      if (index > 3) {
        condition = 'Partly Cloudy';
      }
    }

    return {
      currentWeather: `${condition}, ${temp}°C`,
      predictedWeather: `${prediction} over the next few days.`,
    };
  },
});

const prompt = ai.definePrompt({
  name: 'multilingualAICropAdvisoryPrompt',
  input: {schema: MultilingualAICropAdvisoryInputSchema},
  output: {schema: MultilingualAICropAdvisoryOutputSchema},
  tools: [weatherTool],
  prompt: `You are an AI crop advisor providing advice to farmers.

You will use the current weather and predicted weather patterns as a tool in your decision-making.

Provide crop advice for the following crop: {{{crop}}}
In the following language: {{{language}}}
For the following location: {{{location}}}

Make sure to use weatherTool to get weather information for the location.
`,
});

const multilingualAICropAdvisoryFlow = ai.defineFlow(
  {
    name: 'multilingualAICropAdvisoryFlow',
    inputSchema: MultilingualAICropAdvisoryInputSchema,
    outputSchema: MultilingualAICropAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);