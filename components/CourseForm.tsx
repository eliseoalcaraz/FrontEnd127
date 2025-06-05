"use client";

import { useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";

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
  onCreate: (course: any) => void;
};

const CourseForm = ({ onClose, onCreate }: CourseFormProps) => {
  const { user, isLoggedIn } = useAuth();

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      join_code: "",
      late_threshold_minutes: 15,
      present_threshold_minutes: 5,
      geolocation_latitude: 0.0,
      geolocation_longitude: 0.0,
    },
  });

  // 📍 Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("geolocation_latitude", position.coords.latitude);
          form.setValue("geolocation_longitude", position.coords.longitude);
          toast.success("Location detected successfully.");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Location access denied. Please enter it manually.");
          } else {
            toast.error("Could not detect location.");
          }
          console.error("Geolocation error:", error);
        }
      );
    } else {
      toast.error("Geolocation not supported by this browser.");
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to create a course.");
      return;
    }

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Course created successfully!");
        onCreate(data.course);
        onClose();
      } else {
        toast.error(data.error || "Failed to create course.");
        console.error("Course creation error:", data.error);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error(
        `There was an error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">New Course</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Course name"
                        className="py-5 px-4 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Join Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Code
              </label>
              <FormField
                control={form.control}
                name="join_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Join code"
                        className="py-5 px-4 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Thresholds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thresholds
              </label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="late_threshold_minutes"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Late threshold"
                          className="py-5 px-4 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs min-h-[16px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="present_threshold_minutes"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Present threshold"
                          className="py-5 px-4 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs min-h-[16px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Geolocation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geolocation
              </label>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="geolocation_latitude"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Latitude"
                          className="py-5 px-4 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs min-h-[16px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="geolocation_longitude"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Longitude"
                          className="py-5 px-4 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs min-h-[16px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
