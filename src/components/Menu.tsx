import { FunctionComponent } from "react";
import pb from "@/lib/pocketbase";

interface Props {
  children: React.ReactNode;
}

const Menu: FunctionComponent<Props> = ({ children }) => {
  if (pb.authStore.model?.role == "admin") {
    console.log("admin");
  }

  return (
    <>
      <div className='hidden md:flex h-lvh w-lvw'>
        <div className='w-1/5 h-full'></div>
        <div className='w-4/5 h-full'>{children}</div>
      </div>
    </>
  );
};

export default Menu;
