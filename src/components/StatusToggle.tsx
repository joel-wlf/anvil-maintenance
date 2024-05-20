import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckCircle2, Clock, Construction } from "lucide-react";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface StatusToggleProps {
  setTask: (e: any) => void;
  value: string;
  defaultValue: string;
  disabled?: boolean;
}

const StatusToggle: FunctionComponent<StatusToggleProps> = ({
  setTask,
  value,
  defaultValue,
  disabled
}) => {
    const { t } = useTranslation(["translation"]);

  return (
    <ToggleGroup
      onValueChange={(e) =>
        setTask((prevState: any) => {
          return { ...prevState, status: e };
        })
      }
      type='single'
      value={value}
      defaultValue={defaultValue}
      disabled={disabled || false}
    >
      <ToggleGroupItem
        value='pending'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-zinc-800 disabled:opacity-100'
      >
        <Clock />
        {t("workflow.pending")}
      </ToggleGroupItem>
      <ToggleGroupItem
        value='progress'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-amber-800 disabled:opacity-100'
      >
        <Construction />
        {t("workflow.progress")}
      </ToggleGroupItem>
      <ToggleGroupItem
        value='done'
        className='flex flex-col p-2 h-fit w-full gap-1 data-[state=on]:bg-emerald-800 disabled:opacity-100'
      >
        <CheckCircle2 />
        {t("workflow.done")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default StatusToggle;
