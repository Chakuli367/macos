import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { auth } from 'src/lib/firebase';
import Box from '@mui/material/Box';
import ConversationFlow from "./ConversationFlow";
import type { Message } from '@shared/schema';

export default function ConversationFlowWrapper() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const state = location.state as { messages: Message[]; answers: Record<string, string> };
  
  // Get current user directly (already authenticated via ProtectedRoute)
  const currentUser = auth.currentUser;

  if (!userId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        User ID not found
      </Box>
    );
  }
  
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