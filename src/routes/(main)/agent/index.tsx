'use client';

import { Flexbox } from '@lobehub/ui';
import { memo, useEffect } from 'react';

import MainInterfaceTracker from '@/components/Analytics/MainInterfaceTracker';
import { BP_PENDING_MESSAGE_KEY } from '@/features/BridgePointWelcome/pendingMessage';
import { useChatStore } from '@/store/chat';

import Conversation from './features/Conversation';
import PageTitle from './features/PageTitle';
import Portal from './features/Portal';
import TelemetryNotification from './features/TelemetryNotification';

/**
 * Consume a pending message from the welcome page chat input.
 * Sets the editor content so the user can review and send, or auto-sends.
 */
const usePendingMessage = () => {
  useEffect(() => {
    const pending = sessionStorage.getItem(BP_PENDING_MESSAGE_KEY);
    if (!pending) return;
    sessionStorage.removeItem(BP_PENDING_MESSAGE_KEY);

    // Wait for the editor to be ready, then set the message content
    const timer = setTimeout(() => {
      const editor = useChatStore.getState().mainInputEditor;
      if (editor) {
        editor.setDocument('markdown', pending);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);
};

const ChatPage = memo(() => {
  usePendingMessage();

  return (
    <>
      <PageTitle />
      <Flexbox
        horizontal
        height={'100%'}
        style={{ overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        <Conversation />
        <Portal />
      </Flexbox>
      <MainInterfaceTracker />
      <TelemetryNotification mobile={false} />
    </>
  );
});

export default ChatPage;
