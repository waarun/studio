// use server'
'use server';
/**
 * @fileOverview A flow for generating event descriptions using AI.
 *
 * - generateEventDescription - A function that generates an event description.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  keywords: z.string().describe('Keywords related to the event, separated by commas.'),
});

export type GenerateEventDescriptionInput = z.infer<typeof GenerateEventDescriptionInputSchema>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated event description.'),
});

export type GenerateEventDescriptionOutput = z.infer<typeof GenerateEventDescriptionOutputSchema>;

export async function generateEventDescription(input: GenerateEventDescriptionInput): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const generateEventDescriptionPrompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging event descriptions.

  Based on the event title and keywords provided, generate a compelling and informative event description.

  Title: {{{title}}}
  Keywords: {{{keywords}}}
  `,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateEventDescriptionPrompt(input);
    return output!;
  }
);
