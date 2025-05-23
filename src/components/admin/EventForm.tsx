
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types";
import AiDescriptionGenerator from "./AiDescriptionGenerator";
import { addEvent } from "@/app/server-actions";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s?(AM|PM))?$/i, { message: "Invalid time format (e.g., 09:00 AM or 14:30)." }),
  location: z.string().min(3, { message: "Location is required." }).max(150),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  imageUrl: z.string().url({ message: "Invalid image URL." }).optional().or(z.literal('')),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(2000),
  keywords: z.string().optional(), // For AI generator
  organizer: z.string().optional(),
});

type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  initialData?: Event; // For editing
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: initialData.price || 0,
      imageUrl: initialData.imageUrl || '',
      keywords: initialData.keywords || '',
      organizer: initialData.organizer || '',
    } : {
      title: "",
      date: "",
      time: "",
      location: "",
      price: 0,
      imageUrl: "",
      description: "",
      keywords: "",
      organizer: "",
    },
  });

  const { setValue, watch } = form;
  const watchedTitle = watch("title");
  const watchedKeywords = watch("keywords");

  const handleGeneratedDescription = (generatedDesc: string) => {
    setValue("description", generatedDesc, { shouldValidate: true });
  };

  async function onSubmit(values: EventFormValues) {
    try {
      const eventData: Omit<Event, 'id'> = {
        title: values.title,
        date: values.date,
        time: values.time,
        location: values.location,
        price: values.price,
        imageUrl: values.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(values.title)}`,
        description: values.description,
        keywords: values.keywords,
        organizer: values.organizer,
      };

      if (initialData?.id) {
        // Call updateEvent server action (to be created)
        // const result = await updateEvent(initialData.id, eventData);
        // if (result && 'error' in result && result.error) {
        //   throw new Error(result.error);
        // }
        toast({ title: "Event Updated (Placeholder)", description: `${values.title} has been updated.` });
      } else {
        const result = await addEvent(eventData);
        if (result && 'error' in result && result.error) {
          throw new Error(result.error); // This will be caught by the catch block below
        }
        toast({ title: "Event Created", description: `${values.title} has been successfully created.` });
      }
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error("Event submission error:", error);
      toast({
        title: "Submission Failed",
        description: (error as Error).message || "Could not save the event.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Event" : "Create New Event"}</CardTitle>
        <CardDescription>Fill in the details for the event.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Music Festival" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizer (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Eventide Productions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="e.g., 10:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00 for free" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Central Park, New York or Online" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords for AI (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., music, festival, summer, outdoor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AiDescriptionGenerator
              eventTitle={watchedTitle}
              eventKeywords={watchedKeywords}
              onDescriptionGenerated={handleGeneratedDescription}
              currentDescription={form.getValues("description")}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea rows={8} placeholder="Detailed description of the event..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (initialData ? "Saving Changes..." : "Creating Event...") : (initialData ? "Save Changes" : "Create Event")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

