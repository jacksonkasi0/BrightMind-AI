"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { AssistantRuntimeProvider, useEdgeRuntime } from "@assistant-ui/react";
import {
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: {
    type: "text";
    text: string;
  }[];
};

type ApiResponse = {
  success: boolean;
  messages: Message[];
};

// Helper function to fetch messages from server storage
const getMessagesFromStorage = async (threadId: string): Promise<Message[]> => {
  try {
    const res = await fetch("/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threadId }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch messages: ${res.statusText}`);
    }

    const data: ApiResponse = await res.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages from storage:", error);
    return [];
  }
};

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const threadId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const runtime = useEdgeRuntime({
    api: "/api/chat",
    body: {
      threadId: threadId || "default",
    },
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });

  // Use a ref or state to ensure we only fetch/reset once.
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // If there's no threadId or if we've already fetched/reset once, return immediately
    if (!threadId || hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    const resetRuntimeWithMessages = async () => {
      try {
        const fetchedMessages = await getMessagesFromStorage(threadId);

        if (fetchedMessages.length > 0) {
          console.log("Loaded messages:", fetchedMessages);

          runtime.reset({
            initialMessages: fetchedMessages,
          });
        } else {
          console.warn("No messages found for threadId:", threadId);
          router.push("/"); // Redirect to the home page
        }
      } catch (error) {
        console.error("Error resetting runtime with messages:", error);
        router.push("/"); // Redirect to the home page on error
      }
    };

    resetRuntimeWithMessages();
  }, [threadId, runtime, router]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}