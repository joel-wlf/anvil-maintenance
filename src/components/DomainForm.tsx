import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Compass } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useToast } from "./ui/use-toast";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

interface DomainFormProps {
  setStep: (step: number) => void;
}

const DomainForm: FunctionComponent<DomainFormProps> = ({ setStep }) => {
  const { t } = useTranslation("translation");

  const [formData, setFormData] = useState<{
    url: string;
  }>({ url: "" });

  const { toast } = useToast();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function saveUrl() {
    if (!formData.url) {
      toast({
        description: t("messages.err_enter_domain"),
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("backendUrl", formData.url);
    setStep(2);
  }

  return (
    <Card
      className={clsx(
        "z-10 w-4/5 md:w-2/6 lg:w-1/4 px-4 py-7 flex gap-2 flex-col items-center"
      )}
    >
      <Compass size={70} className='mb-2' />
      <Input
        type='url'
        name='url'
        placeholder={t("auth.enter_domain")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            saveUrl();
          }
        }}
        onChange={handleChange}
        value={formData.url}
      />
      <div className='flex w-full justify-between pt-3'>
        <Button variant='ghost' disabled={true}>
          {t("back")}
        </Button>
        <Button onClick={saveUrl}>{t("submit")}</Button>
      </div>
    </Card>
  );
};

export default DomainForm;
