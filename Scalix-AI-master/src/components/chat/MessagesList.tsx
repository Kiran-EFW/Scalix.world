import type React from "react";
import type { Message } from "@/ipc/ipc_types";
import { forwardRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { SetupBanner } from "../SetupBanner";

import { useStreamChat } from "@/hooks/useStreamChat";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2, RefreshCw, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVersions } from "@/hooks/useVersions";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import { showError, showWarning } from "@/lib/toast";
import { IpcClient } from "@/ipc/ipc_client";
import { chatMessagesAtom } from "@/atoms/chatAtoms";
import { useLanguageModelProviders } from "@/hooks/useLanguageModelProviders";
import { useSettings } from "@/hooks/useSettings";
import { useUserBudgetInfo } from "@/hooks/useUserBudgetInfo";
import { PromoMessage } from "./PromoMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatUpgradeBanner, useChatUpgradeBanner } from "./ChatUpgradeBanner";
import { chatNotify, schedule } from "@/lib/cloudNotifications";

interface MessagesListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

// Loading skeleton component for chat messages
const ChatMessageSkeleton = () => (
  <div className="flex gap-3 mb-4 animate-pulse">
    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(
  function MessagesList({ messages, messagesEndRef, isLoading = false }, ref) {
    const appId = useAtomValue(selectedAppIdAtom);
    const { versions, revertVersion } = useVersions(appId);
    const { streamMessage, isStreaming } = useStreamChat();
    const { isAnyProviderSetup } = useLanguageModelProviders();
    const { settings } = useSettings();
    const setMessages = useSetAtom(chatMessagesAtom);
    const [isUndoLoading, setIsUndoLoading] = useState(false);
    const [isRetryLoading, setIsRetryLoading] = useState(false);

    // Upgrade banner management
    const { showBanner, BannerComponent } = useChatUpgradeBanner();
    const selectedChatId = useAtomValue(selectedChatIdAtom);
    const { userBudget } = useUserBudgetInfo();

    // Detect when to show upgrade banners
    React.useEffect(() => {
      // Only show banners if user is not Pro and not in trial
      const isProEnabled = settings?.enableScalixPro && settings?.proFeatures?.currentPlan !== 'free';
      if (isProEnabled) return;

      // Show trial banner if applicable
      if (settings?.proFeatures?.expiresAt) {
        const expiryDate = new Date(settings.proFeatures.expiresAt);
        const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) {
          showBanner('trial', { daysLeft });
          return;
        }
      }

      // Show usage limit banner if budget exceeded
      if (userBudget && userBudget.usedCredits >= userBudget.totalCredits) {
        showBanner('usage', {
          context: 'ai_tokens',
          current: userBudget.usedCredits,
          limit: userBudget.totalCredits
        });
        return;
      }

      // Show feature-specific banners based on recent actions
      // This would be triggered by specific events in the chat

    }, [settings, userBudget, showBanner]);

    return (
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={ref}
        data-testid="messages-list"
      >
        {isLoading ? (
          // Show loading skeletons
          <>
            <ChatMessageSkeleton />
            <ChatMessageSkeleton />
            <ChatMessageSkeleton />
          </>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className="flex flex-1 items-center justify-center text-gray-500">
              No messages yet
            </div>
            {!isAnyProviderSetup() && <SetupBanner />}
          </div>
        )}
        {!isStreaming && (
          <div className="flex max-w-3xl mx-auto gap-2">
            {!!messages.length &&
              messages[messages.length - 1].role === "assistant" &&
              messages[messages.length - 1].commitHash && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUndoLoading}
                  onClick={async () => {
                    if (!selectedChatId || !appId) {
                      console.error("No chat selected or app ID not available");
                      return;
                    }

                    setIsUndoLoading(true);
                    try {
                      if (messages.length >= 3) {
                        const previousAssistantMessage =
                          messages[messages.length - 3];
                        if (
                          previousAssistantMessage?.role === "assistant" &&
                          previousAssistantMessage?.commitHash
                        ) {
                          console.debug(
                            "Reverting to previous assistant version",
                          );
                          await revertVersion({
                            versionId: previousAssistantMessage.commitHash,
                          });
                          const chat =
                            await IpcClient.getInstance().getChat(
                              selectedChatId,
                            );
                          setMessages(chat.messages);
                        }
                      } else {
                        const chat =
                          await IpcClient.getInstance().getChat(selectedChatId);
                        if (chat.initialCommitHash) {
                          await revertVersion({
                            versionId: chat.initialCommitHash,
                          });
                          try {
                            await IpcClient.getInstance().deleteMessages(
                              selectedChatId,
                            );
                            setMessages([]);
                          } catch (err) {
                            showError(err);
                          }
                        } else {
                          showWarning(
                            "No initial commit hash found for chat. Need to manually undo code changes",
                          );
                        }
                      }
                    } catch (error) {
                      console.error("Error during undo operation:", error);
                      showError("Failed to undo changes");
                    } finally {
                      setIsUndoLoading(false);
                    }
                  }}
                >
                  {isUndoLoading ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <Undo size={16} />
                  )}
                  Undo
                </Button>
              )}
            {!!messages.length && (
              <Button
                variant="outline"
                size="sm"
                disabled={isRetryLoading}
                onClick={async () => {
                  if (!selectedChatId) {
                    console.error("No chat selected");
                    return;
                  }

                  setIsRetryLoading(true);
                  try {
                    // The last message is usually an assistant, but it might not be.
                    const lastVersion = versions[0];
                    const lastMessage = messages[messages.length - 1];
                    let shouldRedo = true;
                    if (
                      lastVersion.oid === lastMessage.commitHash &&
                      lastMessage.role === "assistant"
                    ) {
                      const previousAssistantMessage =
                        messages[messages.length - 3];
                      if (
                        previousAssistantMessage?.role === "assistant" &&
                        previousAssistantMessage?.commitHash
                      ) {
                        console.debug(
                          "Reverting to previous assistant version",
                        );
                        await revertVersion({
                          versionId: previousAssistantMessage.commitHash,
                        });
                        shouldRedo = false;
                      } else {
                        const chat =
                          await IpcClient.getInstance().getChat(selectedChatId);
                        if (chat.initialCommitHash) {
                          console.debug(
                            "Reverting to initial commit hash",
                            chat.initialCommitHash,
                          );
                          await revertVersion({
                            versionId: chat.initialCommitHash,
                          });
                        } else {
                          showWarning(
                            "No initial commit hash found for chat. Need to manually undo code changes",
                          );
                        }
                      }
                    }

                    // Find the last user message
                    const lastUserMessage = [...messages]
                      .reverse()
                      .find((message) => message.role === "user");
                    if (!lastUserMessage) {
                      console.error("No user message found");
                      return;
                    }
                    // Need to do a redo, if we didn't delete the message from a revert.
                    const redo = shouldRedo;
                    console.debug("Streaming message with redo", redo);

                    streamMessage({
                      prompt: lastUserMessage.content,
                      chatId: selectedChatId,
                      redo,
                    });
                  } catch (error) {
                    console.error("Error during retry operation:", error);
                    showError("Failed to retry message");
                  } finally {
                    setIsRetryLoading(false);
                  }
                }}
              >
                {isRetryLoading ? (
                  <Loader2 size={16} className="mr-1 animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Retry
              </Button>
            )}
          </div>
        )}

        {isStreaming &&
          !settings?.enableScalixPro &&
          !userBudget &&
          messages.length > 0 && (
            <PromoMessage
              seed={messages.length * (appId ?? 1) * (selectedChatId ?? 1)}
            />
          )}

        {/* Upgrade Banner */}
        {BannerComponent}

        <div ref={messagesEndRef} />
      </div>
    );
  },
);

