"use client";

import { Thread, useEdgeRuntime } from "@assistant-ui/react";

const Home = () => {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
  });

  return (
    <div className="h-full">
      <Thread runtime={runtime} />
    </div>
  );
};

export default Home;
