import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";

function LoginForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{ url: string }>({ url: "" });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  }

  function saveUrl() {
    setStep(2)
    localStorage.setItem("backendUrl", formData.url);
  }

  return (
    <Card className={clsx('w-3/4 md:w-1/4 px-4 py-7 flex gap-2 flex-col items-center', {'hidden': step != 1})}>
      <Compass size={70} className='mb-2' />
      <Input
        type='url'
        name='url'
        placeholder='Enter Domain'
        onChange={handleChange}
        value={formData.url}
      />
      <Button onClick={saveUrl}>Submit</Button>
    </Card>
  );
}

export default LoginForm;
