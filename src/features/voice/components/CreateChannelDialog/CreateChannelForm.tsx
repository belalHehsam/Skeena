import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { VoiceCategory } from "../../types/voice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextField } from "@/components/common/TextField";

const schema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(80, "Title must be at most 80 characters")
    .trim(),
  categoryId: z.string().min(1, "Select a category"),
});

type FormValues = z.infer<typeof schema>;

interface CreateChannelFormProps {
  categories: VoiceCategory[];
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
}

export function CreateChannelForm({
  categories,
  onSubmit,
  isPending,
}: CreateChannelFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      categoryId: "",
    },
  });

  const titleValue = watch("title") || "";
  const selectedCategoryId = watch("categoryId") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-neutral-400 ml-auto">
            {titleValue.length}/80
          </span>
        </div>
        <TextField
          id="title"
          label="Room Title"
          placeholder="e.g. Discussing React 19 features"
          error={errors.title?.message}
          disabled={isPending}
          maxLength={80}
          {...register("title")}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-800 font-heading">
          Category
        </label>
        <Select
          onValueChange={(val) => setValue("categoryId", val || "", { shouldValidate: true })}
          value={selectedCategoryId}
          disabled={isPending}
        >
          <SelectTrigger className="w-full focus:ring-primary border-neutral-200 dark:border-neutral-800 bg-neutral-50 h-10">
            <SelectValue placeholder="Select a room category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-xs font-medium text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6 cursor-pointer font-heading font-semibold bg-primary text-white hover:bg-primary-600 h-10"
        disabled={isPending}
      >
        {isPending ? "Creating Room..." : "Create Room"}
      </Button>
    </form>
  );
}
