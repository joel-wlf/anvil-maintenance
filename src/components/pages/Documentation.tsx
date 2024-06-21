import { pb } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types.ts"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function Documentation() {
  const navigate = useNavigate();

  const { t } = useTranslation("translation")

  const [documents, setDocuments] = useState<Document[] | RecordModel[] | null>([])

  async function fetchDocuments() {
    const request = await pb
      .collection("documentation")
      .getFullList({ requestKey: null });
    setDocuments(request);
    console.log(request)
  }

  function downloadDoc(record: Document | RecordModel, fileName: string) {
    const url = pb.files.getUrl(record, fileName);
    window.open(url + "?download=1", "_self")
  }

  const DocumentView = () => {
    return documents?.map((document) => {
      const created = format(document.created, "dd-MM-yyyy")
      return <Button onClick={() => downloadDoc(document, document.file)}>{created}</Button>
    })
  }

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDocuments()
  }, []);

  return (
    <>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>
        {t("documentation.title")}
      </p>
      <DocumentView />
    </>
  );
}

export default Documentation;
