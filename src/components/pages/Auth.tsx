import LoginForm from "@/components/LoginForm";
import { useState } from "react";
import DomainForm from "@/components/DomainForm";

function Auth() {
  const [step, setStep] = useState(1);

  return (
    <div className='h-lvh w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center'>
      <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>
      {step == 1 ? (
        <DomainForm setStep={setStep} />
      ) : (
        <LoginForm setStep={setStep} />
      )}
    </div>
  );
}

export default Auth;
