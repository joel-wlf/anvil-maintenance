import { Document } from "@/types";
import { RecordModel } from "pocketbase";
import { FunctionComponent, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Clock, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface DocumentRowProps {
  loading: boolean;
  document?: Document | RecordModel;
  created?: string;
  fetchDocuments: () => void;
}

const DocumentRow: FunctionComponent<DocumentRowProps> = ({
  loading,
  document,
  fetchDocuments,
}) => {
  const { t } = useTranslation("translation");

  const isAdmin = pb.authStore.model?.role == "admin";

  const { toast } = useToast();

  const [downloading, setDownloading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function downloadDoc() {
    setDownloading(true);
    try {
      const url = pb.files.getUrl(document!, document!.file);
      window.open(url + "?download=1", "_self");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  }

  async function deleteDoc() {
    setDeleting(true);
    try {
      await pb.collection("documentation").delete(document!.id);
      fetchDocuments();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      toast({ title: t("messages.success_deleted_doc") });
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Card className='flex flex-col gap-2 p-2 my-2 w-full'>
        <Skeleton className='w-[60%] h-4' />
        <Skeleton className='w-[40%] h-3' />
      </Card>
    );
  } else {
    return (
      <Card className='flex my-2'>
        <div className='flex flex-col gap-1 p-2 w-4/6'>
          <p className='font-medium'>{document!.expand?.task.title}</p>
          <div className='flex text-sm text-[#adadad]'>
            <Clock size='1.3em' className='mr-1' />
            {format(document!.created, "dd-MM-yyyy")}
          </div>
        </div>
        <div className='flex justify-center items-center gap-2 w-2/6'>
          <Button
            className='p-2'
            variant='outline'
            disabled={downloading || deleting}
            onClick={downloadDoc}
          >
            <Download size='1.3em' />
          </Button>
          {isAdmin && (
            <Button
              className='p-2'
              variant='outline'
              disabled={downloading || deleting}
              onClick={deleteDoc}
            >
              <Trash2 size='1.3em' />
            </Button>
          )}
        </div>
      </Card>
    );
  }
};

export default DocumentRow;
