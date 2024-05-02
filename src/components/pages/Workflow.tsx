import { useParams } from "react-router-dom";

function Workflow() {
  const { taskId } = useParams();

  return <>{taskId}</>;
}

export default Workflow;
