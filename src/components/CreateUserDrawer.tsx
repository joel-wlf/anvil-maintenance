import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface CreateUserDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}

const CreateUserDrawer: FunctionComponent<CreateUserDrawerProps> = ({
  open,
  setOpen,
  fetchUsers,
}) => {
  const { t } = useTranslation("translation");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      if (formData.name == "") throw new Error(t("messages.err_enter_name"));
      if (formData.email == "") throw new Error(t("messages.err_enter_email"));
      if (formData.role == "") throw new Error(t("messages.err_select_role"));
      if (formData.password == "")
        throw new Error(t("messages.err_enter_password"));
      if (formData.passwordConfirm == "")
        throw new Error(t("messages.err_confirm_password"));
      if (formData.password != formData.passwordConfirm)
        throw new Error(t("messages.err_password_match"));
      await pb.collection("users").create(formData);
      fetchUsers();
      setLoading(false);
      setOpen(false);
      toast({ title: t("messages.success_created_user") });
    } catch (err: any) {
      setLoading(false);
      toast({ title: err.message, variant: "destructive" });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{t("admin.create_user")}</DrawerTitle>
          <DrawerDescription>
            {t("admin.create_user_description")}
          </DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-2 px-4 pb-5'>
          <Input
            type='text'
            name='name'
            value={formData.name}
            placeholder={t("admin.name_placeholder")}
            onChange={handleChange}
          />
          <Input
            type='email'
            name='email'
            value={formData.email}
            placeholder={t("admin.email_placeholder")}
            onChange={handleChange}
          />
          <Select
            onValueChange={(e) =>
              setFormData((prevState) => {
                return { ...prevState, role: e };
              })
            }
            value={formData.role}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>{t("admin.user")}</SelectItem>
              <SelectItem value='admin'>{t("admin.admin")}</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex items-center justify-between gap-2'>
            <Input
              type='password'
              name='password'
              value={formData.password}
              placeholder={t("admin.password_placeholder")}
              onChange={handleChange}
            />
            <Input
              type='password'
              name='passwordConfirm'
              value={formData.passwordConfirm}
              placeholder={t("admin.password_confirm_placeholder")}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("loading") : t("admin.create_user")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateUserDrawer;
