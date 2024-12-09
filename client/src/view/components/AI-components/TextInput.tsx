const TextInput = ({
  onSend,
  inputText,
  setInputText,
}: {
  onSend: () => void;
  inputText: string;
  setInputText: (value: string) => void;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(); 
    }
  };

  return (
    <div
      className="text-input-field"
      contentEditable="true"
      onInput={(e) => setInputText(e.currentTarget.textContent || "")}
      onKeyDown={handleKeyDown}
      style={{
        minHeight: "40px",
        maxHeight: "200px",
        overflow: "auto",
        outline: "none",
        textAlign: "left",
      }}
      suppressContentEditableWarning
    ></div>
  );
};


export default TextInput;