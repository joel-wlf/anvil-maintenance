import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, LogIn } from "lucide-react";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";

function LoginForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    url: string;
    email: string;
    password: string;
  }>({ url: "", email: "", password: "" });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function saveUrl() {
    if (!formData.url) {
      alert("Please enter a domain");
      return;
    }
    localStorage.setItem("backendUrl", formData.url);
    setStep(2);
  }

  return (
    <>
      <Card
        className={clsx(
          "w-3/4 md:w-1/4 px-4 py-7 flex gap-2 flex-col items-center",
          { hidden: step != 1 }
        )}
      >
        <Compass size={70} className='mb-2' />
        <Input
          type='url'
          name='url'
          placeholder='Enter Domain'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUrl();
            }
          }}
          onChange={handleChange}
          value={formData.url}
        />
        <Button onClick={saveUrl}>Submit</Button>
      </Card>
      <Card
        className={clsx(
          "w-3/4 md:w-1/4 px-4 py-7 flex gap-2 flex-col items-center",
          { hidden: step != 2 }
        )}
      >
        <LogIn size={70} className='mb-2' />
        <Input
          type='email'
          name='url'
          placeholder='Email'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUrl();
            }
          }}
          onChange={handleChange}
          value={formData.url}
        />
        <Input
          type='password'
          name='password'
          placeholder='Password'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUrl();
            }
          }}
          onChange={handleChange}
          value={formData.url}
        />
        <Button onClick={saveUrl}>Submit</Button>
      </Card>
    </>
  );
}

export default LoginForm;
