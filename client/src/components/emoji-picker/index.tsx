import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface EmojiPickerComponentProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPickerComponent = ({
  onSelectEmoji,
}: EmojiPickerComponentProps) => {
  const handleEmojiSelect = (emoji: EmojiClickData) => {
    onSelectEmoji(emoji.emoji);
  };

  return (
    <div className="relative w-full">
      <EmojiPicker onEmojiClick={handleEmojiSelect} lazyLoadEmojis />
    </div>
  );
};

export default EmojiPickerComponent;
