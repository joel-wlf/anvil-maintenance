import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useState } from "react";

function LoginForm() {
  const [formData, setFormData] = useState({
    url: "",
  });

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    
  }

  return (
    <Card className='w-3/4 md:w-1/4 px-4 py-7 flex gap-2 flex-col items-center'>
      <Compass size={70} className='mb-2' />
      <Input type='url' placeholder='Enter Domain' />
      <Button>Submit</Button>
    </Card>
  );
}

export default LoginForm;
