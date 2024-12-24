"use client";

import React, { useEffect, useState } from "react";

// ** import third-party libraries
import { nanoid } from "nanoid";

import { useRouter } from "next/navigation";
import { AssistantRuntimeProvider, useEdgeRuntime } from "@assistant-ui/react";
import {
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

export function InitialRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // Initialize router for redirection
  const threadId = nanoid();

  const runtime = useEdgeRuntime({
    api: "/api/chat",
    body: {
      threadId,
    },
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },

  });

  const [hasRedirected, setHasRedirected] = useState(false); // Prevent multiple redirects

  useEffect(() => {
    // Subscribe to thread state changes
    const unsubscribe = runtime.thread.subscribe(() => {
      const messages = runtime.thread.getState().messages;

      console.log("Messages:", messages);

      if (messages.length > 0 && !hasRedirected) {
        setHasRedirected(true); // Mark as redirected to prevent loops
        router.push(`/chat/${threadId}`);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [runtime.thread, threadId, router, hasRedirected]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
