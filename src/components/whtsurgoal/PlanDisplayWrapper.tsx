import { useParams } from "react-router-dom";
import PlanDisplay from "./PlanDisplay";

export default function PlanDisplayWrapper() {
  const { userId } = useParams<{ userId: string }>();
  if (!userId) return <p>User not specified</p>;
  return <PlanDisplay />;
}
