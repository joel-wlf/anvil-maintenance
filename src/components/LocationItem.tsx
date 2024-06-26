import EditLocationDialog from "@/components/EditLocationDialog";
import EditLocationDrawer from "@/components/EditLocationDrawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { pb } from "@/lib/pocketbase";
import { Clock } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

interface LocationItemProps {
  id: string;
  name: string;
  description: string;
  created: string;
  fetchLocations: () => void;
}

const LocationItem: FunctionComponent<LocationItemProps> = ({
  id,
  name,
  description,
  created,
  fetchLocations,
}) => {
  const { t } = useTranslation(["translation"]);

  const { toast } = useToast();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editLocationOpen, setEditLocationOpen] = useState(false);

  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  async function deleteLocation(id: string) {
    try {
      setDeleteLoading(true);
      await pb.collection("locations").delete(id);
      fetchLocations();
    } catch (err: any) {
      setDeleteLoading(false);
      toast({
        description: t("messages.err_location_delete"),
        variant: "destructive",
      });
    }
  }

  return (
    <Card className='p-3'>
      <div className='flex items-center justify-between w-full'>
        <p className='text-[#adadad] max-w-[80%]'>
          <span className='font-medium text-white'>{name}</span>
          {description && ` - ${description}`}
        </p>
      </div>
      <Separator className='my-1 mt-2' />
      <div className='flex text-[#adadad] items-center justify-start w-auto gap-2'>
        <Clock size='1.3em' />
        <Button className='p-0 text-[#adadad]' variant='link'>
          {created.split(" ")[0]}
        </Button>
      </div>
      <Separator className='my-1 mb-2' />
      <div className='flex gap-2'>
        <Button
          variant='destructive'
          disabled={deleteLoading}
          className='w-full'
          onClick={() => deleteLocation(id)}
        >
          {deleteLoading ? t("delete_loading") : t("delete")}
        </Button>
        <Button
          variant='outline'
          disabled={deleteLoading}
          className='w-full'
          onClick={() => setEditLocationOpen(true)}
        >
          {t("edit")}
        </Button>
      </div>
      {isDesktop ? (
        <EditLocationDialog
          key={id}
          id={id}
          name={name}
          description={description}
          open={editLocationOpen}
          setOpen={setEditLocationOpen}
          fetchLocations={fetchLocations}
        />
      ) : (
        <EditLocationDrawer
          key={id}
          id={id}
          name={name}
          description={description}
          open={editLocationOpen}
          setOpen={setEditLocationOpen}
          fetchLocations={fetchLocations}
        />
      )}
    </Card>
  );
};

export default LocationItem;
