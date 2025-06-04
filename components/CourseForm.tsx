"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get user info

// No longer need coursesSample for actual API interaction
// import { coursesSample } from "@/content/data";

const courseFormSchema = z.object({
  name: z.string().min(3, "Course title must be at least 3 characters."),
  join_code: z.string().min(3, "Join code is required."),
  late_threshold_minutes: z.coerce
    .number()
    .min(1, "Must be at least 1 minute."),
  present_threshold_minutes: z.coerce
    .number()
    .min(1, "Must be at least 1 minute."),
  geolocation_latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  geolocation_longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
});

type CourseFormProps = {
  onClose: () => void;
  // onCreate is still useful if the parent needs to update its state
  // with the new course data after the API call, but it will receive
  // the actual course object returned by the backend.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreate: (course: any) => void; // Change type to any or a more specific Course type
};

const CourseForm = ({ onClose, onCreate }: CourseFormProps) => {
  const { user, isLoggedIn } = useAuth(); // Get current user info from context

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      join_code: "",
      late_threshold_minutes: 15,
      present_threshold_minutes: 5,
      geolocation_latitude: 0.0, // Consider getting actual user location as a default
      geolocation_longitude: 0.0, // Consider getting actual user location as a default
    },
  });

  const onSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to create a course.");
      return;
    }

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send form values directly
      });

      const data = await response.json();

      if (response.ok) {
        // Backend should return the created course object
        toast.success(data.message || "Course created successfully!");
        onCreate(data.course); // Pass the actual course object from backend
        onClose(); // Close the form
      } else {
        // Handle backend errors (e.g., duplicate join code, validation errors)
        toast.error(data.error || "Failed to create course.");
        console.error("Course creation error:", data.error);
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error("Network or unexpected error creating course:", error);
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">New Course</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: "name", type: "text", placeholder: "Course name" },
              { name: "join_code", type: "text", placeholder: "Join code" },
              {
                name: "late_threshold_minutes",
                type: "number",
                placeholder: "Late threshold (minutes)",
              },
              {
                name: "present_threshold_minutes",
                type: "number",
                placeholder: "Present threshold (minutes)",
              },
              {
                name: "geolocation_latitude",
                type: "number",
                placeholder: "Latitude (e.g. 10.3157)",
              },
              {
                name: "geolocation_longitude",
                type: "number",
                placeholder: "Longitude (e.g. 123.8854)",
              },
            ].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof z.infer<typeof courseFormSchema>}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...f}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="py-5 px-4 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-lg px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg px-4 py-2 bg-myred text-white"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CourseForm;
