import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/category";
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
  categories: Category[];
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
}

export function CreateChannelForm({
  categories,
  onSubmit,
  isPending,
}: CreateChannelFormProps) {
  const { t } = useTranslation("common");
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
          label={t("voice.roomTitle")}
          placeholder={t("voice.roomTitlePlaceholder")}
          error={errors.title?.message}
          disabled={isPending}
          maxLength={80}
          {...register("title")}
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-heading">
          {t("voice.category")}
        </label>
        <Select
          onValueChange={(val) => setValue("categoryId", val || "", { shouldValidate: true })}
          value={selectedCategoryId || undefined}
          disabled={isPending}
        >
          <SelectTrigger className="w-full focus:ring-primary border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 h-10">
            <SelectValue placeholder={t("voice.selectCategory")}>
              {(value) => categories.find((c) => c._id === value)?.name || value}
            </SelectValue>
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
        {isPending ? t("voice.creatingRoom") : t("voice.createRoom")}
      </Button>
    </form>
  );
}
