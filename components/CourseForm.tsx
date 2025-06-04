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

import { coursesSample } from "@/content/data";

const courseFormSchema = z.object({
  name: z.string().min(3, "Course title must be at least 3 characters."),
  join_code: z.string().min(3, "Join code is required."),
  late_threshold_minutes: z.coerce.number().min(1),
  present_threshold_minutes: z.coerce.number().min(1),
  geolocation_latitude: z.coerce.number().min(-90).max(90),
  geolocation_longitude: z.coerce.number().min(-180).max(180),
});

type CourseFormProps = {
  onClose: () => void;
  onCreate: (course: any) => void;
};

const CourseForm = ({ onClose, onCreate }: CourseFormProps) => {
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

  const onSubmit = (values: z.infer<typeof courseFormSchema>) => {
    const course = {
      course_id: coursesSample.length + 1,
      ...values,
      created_at: Math.floor(Date.now() / 1000),
      host_id: 1,
      host_name: "John Doe",
    };
    onCreate(course);
    toast.success("Course created!");
    onClose();
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
              { name: "late_threshold_minutes", type: "number", placeholder: "Late threshold (minutes)" },
              { name: "present_threshold_minutes", type: "number", placeholder: "Present threshold (minutes)" },
              { name: "geolocation_latitude", type: "number", placeholder: "Latitude (e.g. 10.3157)" },
              { name: "geolocation_longitude", type: "number", placeholder: "Longitude (e.g. 123.8854)" },
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
              <Button type="button" variant="outline" onClick={onClose} className="rounded-lg px-4 py-2">
                Cancel
              </Button>
              <Button type="submit" className="rounded-lg px-4 py-2 bg-myred text-white">
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
