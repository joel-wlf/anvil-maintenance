import { pb } from "@/lib/pocketbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

function Facility() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      <Tabs defaultValue='appliances' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='appliances'>Appliances</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
        </TabsList>
        <TabsContent value='appliances'>
          <Button variant="outline" className="w-full">Add Appliance</Button>
        </TabsContent>
        <TabsContent value='locations'>Locations</TabsContent>
      </Tabs>
    </div>
  );
}

export default Facility;
