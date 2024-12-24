"use client";

import { Thread } from "@assistant-ui/react";

// ** import tools ui
import { WebSearchToolUI } from "@/tools/weather/WebSearchToolUI";

// ** import components
// import { Thread } from "@/components/assistant-ui/thread";

// ** import providers
import { InitialRuntimeProvider } from "@/app/(chat)/RuntimeProvider";

const DefaultPage = () => {
  return (
    <div className="h-full">
      <InitialRuntimeProvider>
        <Thread />
        <WebSearchToolUI />
      </InitialRuntimeProvider>
    </div>
  );
};

export default DefaultPage;
