import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Paperclip, CodeXml, Globe, ArrowUp, Square, Plus } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  onAbort?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isStreaming = false,
  onAbort,
}) => {
  const [text, setText] = useState<string>('');
  const [showActionsMenu, setShowActionsMenu] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };

    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showActionsMenu]);

  const handleSubmit = (): void => {
    if (!text.trim() || disabled) return;
    const submittedText = text.trim();
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(submittedText);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="chat-card-input-wrapper">
      <div className="chat-card-input-box">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gohard anything..."
          rows={1}
          disabled={disabled || isStreaming}
          className="chat-card-textarea"
        />

        <div className="chat-card-input-toolbar">
          <div className="card-toolbar-left">
            <div className="desktop-tools-group">
              <button className="card-tool-box" title="Attach file" aria-label="Attach file">
                <Paperclip size={16} />
              </button>
              <button className="card-tool-box" title="Code & Tools" aria-label="Code & Tools">
                <CodeXml size={16} />
              </button>
              <button className="card-tool-box" title="Web Search" aria-label="Web Search">
                <Globe size={16} />
              </button>
            </div>

            <div ref={actionsRef} className="mobile-actions-container">
              <button
                type="button"
                className={`card-tool-box mobile-plus-btn ${showActionsMenu ? 'active' : ''}`}
                title="Add attachment or action"
                aria-label="Add attachment or action"
                  onClick={() => {
                  setShowActionsMenu((prev) => !prev);
                }}
              >
                <Plus size={18} className={`plus-icon ${showActionsMenu ? 'rotated' : ''}`} />
              </button>

              {showActionsMenu && (
                <div className="mobile-actions-menu">
                  <button type="button" className="mobile-action-item" onClick={() => setShowActionsMenu(false)}>
                    <Paperclip size={16} />
                    <span>Attach file</span>
                  </button>
                  <button type="button" className="mobile-action-item" onClick={() => setShowActionsMenu(false)}>
                    <CodeXml size={16} />
                    <span>Code & Tools</span>
                  </button>
                  <button type="button" className="mobile-action-item" onClick={() => setShowActionsMenu(false)}>
                    <Globe size={16} />
                    <span>Web Search</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card-toolbar-right">
            {isStreaming ? (
              <button
                className="card-send-btn active streaming-stop-btn"
                onClick={onAbort}
                title="Stop generation"
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                className={`card-send-btn ${text.trim() ? 'active' : ''}`}
                onClick={handleSubmit}
                disabled={!text.trim() || disabled}
                title="Send message"
              >
                <ArrowUp size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
