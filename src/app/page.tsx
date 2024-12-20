"use client";

import {
  AssistantRuntimeProvider,
  Thread,
  useEdgeRuntime,
} from "@assistant-ui/react";

import {
  WebSpeechSynthesisAdapter,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";

import { WebSearchToolUI } from "@/tools/WebSearchToolUI";

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
