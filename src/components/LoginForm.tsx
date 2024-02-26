import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, LogIn } from "lucide-react";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";
import pb from "@/lib/pocketbase.ts";

function LoginForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    url: string;
    email: string;
    password: string;
  }>({ url: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

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

  async function login() {
    try {
      setLoading(true);
      const authData = await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);
      setLoading(false);
      alert(JSON.stringify(authData));
    } catch (error) {
      alert(error);
      setLoading(false);
    }
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
          "w-3/4 md:w-2/6 px-4 py-7 flex gap-2 flex-col items-center",
          { hidden: step != 2 }
        )}
      >
        <LogIn size={70} className='mb-2' />
        <code className='w-full text-center font-semibold text-sm underline underline-offset-2'>
          {formData.url}
        </code>
        <Input
          type='email'
          name='email'
          placeholder='Email'
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
          placeholder='Password'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          onChange={handleChange}
          value={formData.password}
        />
        <Button onClick={login} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Card>
    </>
  );
}

export default LoginForm;
