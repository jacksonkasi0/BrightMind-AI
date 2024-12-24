"use client";

// Add this line at the top level
export const runtime = 'edge';

import { Thread } from "@assistant-ui/react";

// ** import tools ui
import { WebSearchToolUI } from "@/tools/weather/WebSearchToolUI";

// ** import components
// import { Thread } from "@/components/assistant-ui/thread";

// ** import providers
import { RuntimeProvider } from "./RuntimeProvider";

const ChatPage = () => {
  return (
    <div className="h-full">
      <RuntimeProvider>
        <Thread />
        <WebSearchToolUI />
      </RuntimeProvider>
    </div>
  );
};

export default ChatPage;