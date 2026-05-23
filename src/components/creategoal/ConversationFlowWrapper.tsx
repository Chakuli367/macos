import { useLocation, useParams } from "react-router-dom";
import ConversationFlow from "./ConversationFlow";

export function ConversationFlowWrapper() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const state = location.state as { messages: Message[]; answers: Record<string, string> };

  if (!userId) return <div>User ID not found</div>;

  return (
    <ConversationFlow
      avatar={null}
      messages={state?.messages || []}
      answers={state?.answers || {}}
      setMessages={() => {}}
      onSendMessage={() => {}}
      isLoading={false}
      progress={0}
    />
  );
}
