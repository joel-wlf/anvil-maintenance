import { pb } from "@/lib/pocketbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Settings() {
  const { t, i18n } = useTranslation(["translation"]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>
        {t("settings.title")}
      </p>
      <div className='flex flex-col w-full gap-2 my-2'>
        <Card className='flex flex-col gap-2 w-full p-3'>
          <p className='text-xl md:text-2xl font-semibold'>
            {t("settings.language")}
          </p>
          <Select value={i18n.language} onValueChange={(e: string) => i18n.changeLanguage(e)}>
            <SelectTrigger>
              <SelectValue placeholder={t("settings.lang_placeholder")} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='de'>Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>
    </>
  );
}

export default Settings;
