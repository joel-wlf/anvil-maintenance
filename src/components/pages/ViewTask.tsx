import { useParams } from "react-router-dom";

function ViewTask() {
  const { taskId } = useParams();
  return <>{taskId}</>;
}

export default ViewTask;
