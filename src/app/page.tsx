"use client";

import {
  AssistantRuntimeProvider,
  useEdgeRuntime,
} from "@assistant-ui/react";

import {
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

import { WebSearchToolUI } from "@/tools/WebSearchToolUI";
import { Thread } from "@/components/assistant-ui/thread";


const Home = () => {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
        <WebSearchToolUI />
      </AssistantRuntimeProvider>
    </div>
  );
};

export default Home;
