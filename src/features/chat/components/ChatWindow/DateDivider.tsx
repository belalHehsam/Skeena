import { useTranslation } from "react-i18next";
import { formatDateDivider } from "../../utils/groupMessagesByDate";

interface DateDividerProps {
  dateString: string;
}

export function DateDivider({ dateString }: DateDividerProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language || "en";

  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-[1px] flex-1 bg-border" />
      <span className="mx-4 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-500 font-sans shadow-sm">
        {formatDateDivider(dateString, locale)}
      </span>
      <div className="h-[1px] flex-1 bg-border" />
    </div>
  );
}
export default DateDivider;
