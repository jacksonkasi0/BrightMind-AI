"use client";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  ThreadWelcome,
} from "@assistant-ui/react";
import type { FC } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowDownIcon,
  AudioLinesIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  StopCircleIcon,
  Mic,
  PaperclipIcon,
} from "lucide-react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

import { AttachmentPrimitive } from "@assistant-ui/react";

import { cn } from "@/lib/utils";

export const Thread: FC = () => {
  return (
    <ScrollAreaPrimitive.Root asChild>
      <ThreadPrimitive.Root className="bg-background h-full"

       >
        <ScrollAreaPrimitive.Viewport className="thread-viewport" asChild>
          <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
            <MyThreadWelcome />

            <ThreadPrimitive.Messages
              components={{
                UserMessage: MyUserMessage,
                EditComposer: MyEditComposer,
                AssistantMessage: MyAssistantMessage,
              }}
            />

            <ComposerPrimitive.Attachments
              components={{
                Attachment: MyComposerAttachment,
                Document: MyComposerAttachment,
                File: MyComposerAttachment,
                Image: MyComposerAttachment
              }}
            />

            <div className="min-h-8 flex-grow" />

            <div className="sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
              <MyThreadScrollToBottom />
              <MyComposer />
            </div>
          </ThreadPrimitive.Viewport>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
      </ThreadPrimitive.Root>
    </ScrollAreaPrimitive.Root>
  );
};

const MyComposerAttachment = () => (
  <AttachmentPrimitive.Root>
    <AttachmentPrimitive.Root />
    <AttachmentPrimitive.unstable_Thumb />
    <AttachmentPrimitive.Name />
    <AttachmentPrimitive.Remove />
  </AttachmentPrimitive.Root>
);

const MyThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const MyThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestion-container mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
      <ThreadWelcome.Suggestion
        suggestion={{
          prompt: "What is Healthcare AI?",
        }}
      />
      <ThreadWelcome.Suggestion
        suggestion={{
          prompt: "How can AI assist in diagnostics?",
        }}
      />
      <ThreadWelcome.Suggestion
        suggestion={{
          prompt: "What are the benefits of AI in healthcare?",
        }}
      />
      <ThreadWelcome.Suggestion
        suggestion={{
          prompt: "How does AI improve patient outcomes?",
        }}
      />
    </div>
  );
};

const MyThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow flex-col items-center justify-center">
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <p className="mt-4 font-medium text-lg">How can I help you today?</p>
      </div>
      <MyThreadWelcomeSuggestions />
    </ThreadPrimitive.Empty>
  );
};

const MyComposer: FC = () => {
  const handleVoiceInput = () => {
    // Start voice input
  };

  
  return (
    <ComposerPrimitive.Root className="focus-within:border-aui-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in gap-2">

      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerPrimitive.AddAttachment className="my-2.5 size-8 p-2">
        <TooltipIconButton tooltip="Add Attachment" variant="default">
          <PaperclipIcon  />
        </TooltipIconButton>
      </ComposerPrimitive.AddAttachment>

      {/* NOTE: Hided Mic Input */}
      <TooltipIconButton
        tooltip="Voice Input"
        variant="default"
        className="my-2.5 size-8 p-2 hidden"
        onClick={handleVoiceInput}
      >
        <Mic />
      </TooltipIconButton>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>
  );
};

const MyUserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <MyUserActionBar />

      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>

      <MyBranchPicker className="col-span-full col-start-1 row-start-2 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const MyUserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 mr-3 mt-2.5 flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const MyEditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root
      className="mx-auto flex w-full max-w-2xl flex-col justify-end gap-1 rounded-3xl 
        bg-gray-100 dark:bg-white/15"
    >
      <ComposerPrimitive.Input className="flex h-8 w-full resize-none bg-transparent p-4 pb-0 text-gray-900 outline-none dark:text-white" />

      <div className="m-3 mt-2 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel
          className="rounded-full bg-white border px-3 py-2 text-sm font-semibold text-gray-900 
            hover:bg-gray-100 transition-colors ease-in dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          Cancel
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send
          className="rounded-full bg-gray-900 px-3 py-2 text-sm font-semibold text-white 
            hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          Send
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const MyAssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>

      <MyAssistantActionBar />

      <MyBranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const MyAssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:p-1"
    >
      <MessagePrimitive.If speaking={false}>
        <ActionBarPrimitive.Speak asChild>
          <TooltipIconButton tooltip="Read aloud">
            <AudioLinesIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.Speak>
      </MessagePrimitive.If>
      <MessagePrimitive.If speaking>
        <ActionBarPrimitive.StopSpeaking asChild>
          <TooltipIconButton tooltip="Stop">
            <StopCircleIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.StopSpeaking>
      </MessagePrimitive.If>
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const MyBranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
