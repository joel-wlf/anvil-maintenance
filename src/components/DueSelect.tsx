import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface DueSelectProps {
  due: Date | undefined;
  setDue: (value: Date | undefined) => void;
  disabled?: boolean;
}

const DueSelect: FunctionComponent<DueSelectProps> = ({
  due,
  setDue,
  disabled,
}) => {
  const { t } = useTranslation(["translation"]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled || false}
          className={cn(
            "w-full justify-start text-left font-normal disabled:opacity-100",
            !due && "text-muted-foreground"
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {due ? format(due, "yyyy-MM-dd") : <span>{t("workflow.due")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={due}
          onSelect={setDue}
          className='rounded-md border'
        />
      </PopoverContent>
    </Popover>
  );
};

export default DueSelect;
