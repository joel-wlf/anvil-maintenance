import { FunctionComponent } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CreateUserDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
 
const CreateUserDrawer: FunctionComponent<CreateUserDrawerProps> = ({open, setOpen}) => {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className='text-left'>
            <DrawerTitle>Create User</DrawerTitle>
            <DrawerDescription>
              Create a new user for your organisation.
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
}
 
export default CreateUserDrawer;