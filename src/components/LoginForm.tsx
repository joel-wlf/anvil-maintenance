import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initializePb } from "@/lib/pocketbase.ts";
import clsx from "clsx";
import { LogIn } from "lucide-react";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  setStep: (step: number) => void;
}

const LoginForm: FunctionComponent<LoginFormProps> = ({ setStep }) => {
  const { t } = useTranslation(['translations'])

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function login() {
    try {
      let pb = initializePb(localStorage.getItem('backendUrl'))
      setLoading(true);
      await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);
      setLoading(false);
      navigate("/dashboard");
    } catch {
      toast({
        title: t("messages.err_generic"),
        description: t("messages.err_check_input"),
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <Card
      className={clsx(
        "z-10 w-4/5 md:w-2/6 lg:w-1/4 px-4 py-7 flex gap-2 flex-col items-center"
      )}
    >
      <LogIn size={70} className='mb-2' />
      <code className='w-full text-center font-semibold text-sm underline underline-offset-2'>
        {localStorage.getItem("backendUrl")}
      </code>
      <Input
        type='email'
        name='email'
        placeholder={t("email")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            login();
          }
        }}
        onChange={handleChange}
        value={formData.email}
      />
      <Input
        type='password'
        name='password'
        placeholder={t("password")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            login();
          }
        }}
        onChange={handleChange}
        value={formData.password}
      />
      <div className='flex w-full justify-between pt-3'>
        <Button variant='ghost' onClick={() => setStep(1)} disabled={loading}>
          {t("back")}
        </Button>
        <Button onClick={login} disabled={loading}>
          {loading ? t("loading") : t("submit")}
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm;
