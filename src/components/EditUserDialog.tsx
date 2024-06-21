import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface EditUserDialogProps {
  id: string;
  email: string;
  name: string;
  role: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUsers: () => void;
}

const EditUserDialog: FunctionComponent<EditUserDialogProps> = ({
  id,
  email,
  name,
  role,
  open,
  setOpen,
  fetchUsers,
}) => {
  const { t } = useTranslation("translation");

  const [formData, setFormData] = useState({
    name: name,
    email: email,
    role: role,
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
      await pb.collection("users").update(id, formData);
      fetchUsers();
      setLoading(false);
      setOpen(false);
      toast({ title: t("messages.success_updated_user") });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className='text-left'>
          <DialogTitle>{t("admin.edit_user")}</DialogTitle>
          <DialogDescription>{`${t(
            "admin.edit_user_description"
          )} "${email}"`}</DialogDescription>
        </DialogHeader>
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
              <SelectValue placeholder={t("admin.role_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>{t("admin.user")}</SelectItem>
              <SelectItem value='admin'>{t("admin.admin")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("loading") : t("admin.edit_user")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
