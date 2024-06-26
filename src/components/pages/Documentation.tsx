import { pb } from "@/lib/pocketbase";
import { RecordModel } from "pocketbase";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Document } from "@/types";
import { format } from "date-fns";
import DocumentRow from "@/components/DocumentRow"

function Documentation() {
  const navigate = useNavigate();

  const { t } = useTranslation("translation");

  const [documents, setDocuments] = useState<Document[] | RecordModel[] | null>(
    []
  );

  const [loading, setLoading] = useState(false);

  async function fetchDocuments() {
    setLoading(true);
    const request = await pb
      .collection("documentation")
      .getFullList({ requestKey: null, expand: "task" });
    setDocuments(request);
    setLoading(false);
  }

  const DocumentView = () => {
    return documents?.map((document) => {
      const created = format(document.created, "dd-MM-yyyy");
      return (
        <DocumentRow
          key={document.id}
          loading={false}
          document={document}
          created={created}
          fetchDocuments={fetchDocuments}
        />
      );
    });
  };

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
    fetchDocuments();
  }, []);

  return (
    <>
      <p className='text-2xl md:text-3xl font-semibold md:pt-2'>
        {t("documentation.title")}
      </p>
      {loading ? (
        <>
          <DocumentRow loading={true} fetchDocuments={fetchDocuments} />
          <DocumentRow loading={true} fetchDocuments={fetchDocuments} />
          <DocumentRow loading={true} fetchDocuments={fetchDocuments} />
          <DocumentRow loading={true} fetchDocuments={fetchDocuments} />
          <DocumentRow loading={true} fetchDocuments={fetchDocuments} />
        </>
      ) : (
        <DocumentView />
      )}
    </>
  );
}

export default Documentation;
