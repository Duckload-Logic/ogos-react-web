import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

export const addStudentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  course: z.string().min(3, "Course is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Invalid phone number")
    .max(15, "Invalid phone number"),
  dateEnrolled: z.string().optional(),
  institutionType: z.enum(["Private", "Public"]),
  numberOfSiblings: z.number().int().min(0, "Cannot be negative").optional(),
});

export type AddStudentForm = z.infer<typeof addStudentSchema>;

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddStudentForm) => void;
  courses: { value: string; label: string }[];
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onSubmit,
  courses,
}: AddStudentModalProps) {
  const form = useForm<AddStudentForm>({
    resolver: zodResolver(addStudentSchema),
  });

  const handleSubmit = (data: AddStudentForm) => {
    onSubmit(data);
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Add Student Record</h3>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Name *
              </label>
              <input
                {...form.register("name")}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {String(form.formState.errors.name.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Course *
              </label>
              <select
                {...form.register("course")}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              >
                <option value="">Select Course</option>
                {courses.slice(1).map((course) => (
                  <option
                    key={course.value}
                    value={course.value}
                  >
                    {course.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.course && (
                <p className="mt-1 text-sm text-destructive">
                  {String(form.formState.errors.course.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Email *
              </label>
              <input
                {...form.register("email")}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {String(form.formState.errors.email.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Phone *
              </label>
              <input
                {...form.register("phone")}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {String(form.formState.errors.phone.message)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Institution Type
              </label>
              <select
                {...form.register("institutionType")}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Number of Siblings
              </label>
              <input
                type="number"
                min={0}
                {...form.register("numberOfSiblings", {
                  valueAsNumber: true,
                })}
                className={cn(
                  "w-full rounded-lg border border-border bg-input px-4 py-2",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                form.reset();
              }}
              className={cn(
                "rounded-lg border border-gray-300 px-4 py-2 font-medium",
                "text-foreground transition-colors hover:bg-gray-50",
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "rounded-lg bg-primary px-4 py-2 font-medium",
                "text-primary-foreground transition-colors hover:bg-primary/90",
              )}
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
