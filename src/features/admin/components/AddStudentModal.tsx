import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
      <div className="bg-card rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Student Record</h3>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name *
              </label>
              <input
                {...form.register("name")}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {String(form.formState.errors.name.message)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course *
              </label>
              <select
                {...form.register("course")}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Course</option>
                {courses.slice(1).map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.course && (
                <p className="text-sm text-destructive mt-1">
                  {String(form.formState.errors.course.message)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                {...form.register("email")}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {String(form.formState.errors.email.message)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone *
              </label>
              <input
                {...form.register("phone")}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {String(form.formState.errors.phone.message)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Institution Type
              </label>
              <select
                {...form.register("institutionType")}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Siblings
              </label>
              <input
                type="number"
                min={0}
                {...form.register("numberOfSiblings", {
                  valueAsNumber: true,
                })}
                className="bg-input w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="px-4 py-2 rounded-lg border border-gray-300 text-foreground hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Add Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
