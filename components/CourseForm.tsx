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

const courseFormSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters."),
});

type CourseFormProps = {
  onClose: () => void;
  onCreate: (title: string) => void;
};

const CourseForm = ({ onClose, onCreate }: CourseFormProps) => {
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof courseFormSchema>) => {
    onCreate(values.title);
    toast.success("Course created!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">New Course</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter course title"
                      {...field}
                      className="py-5 px-4 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs min-h-[16px]" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-lg px-4 py-2"
              >
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
