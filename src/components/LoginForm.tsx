import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import pb from "@/lib/pocketbase.ts";
import clsx from "clsx";
import { Compass, LogIn } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<{
    url: string;
    email: string;
    password: string;
  }>({ url: "", email: "", password: "" });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);
      setLoading(false);
      navigate("/dashboard");
    } catch {
      alert("Something went wrong! Please check your input.");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <Card
        className={clsx(
          "z-10 w-4/5 md:w-2/6 lg:w-1/4 px-4 py-7 flex gap-2 flex-col items-center",
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
        <div className='flex w-full justify-between pt-3'>
          <Button variant='ghost' disabled={true}>
            Back
          </Button>
          <Button onClick={saveUrl}>Submit</Button>
        </div>
      </Card>
      <Card
        className={clsx(
          "z-10 w-4/5 md:w-2/6 lg:w-1/4 px-4 py-7 flex gap-2 flex-col items-center",
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
        <div className='flex w-full justify-between pt-3'>
          <Button variant='ghost' onClick={() => setStep(1)} disabled={loading}>
            Back
          </Button>
          <Button onClick={login} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </Card>
    </>
  );
}

export default LoginForm;
