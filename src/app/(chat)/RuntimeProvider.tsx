"use client";

import React, { useEffect, useState } from "react";

// ** import third-party libraries
import { nanoid } from "nanoid";

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
      const { messages, isRunning } = runtime.thread.getState();

      // Check if messages are present and response is complete
      if (messages.length > 0 && !isRunning && !hasRedirected) {
        setHasRedirected(true); // Mark as redirected to prevent loops
        window.history.replaceState({}, "", `/chat/${threadId}`);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [runtime.thread, threadId, hasRedirected]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
