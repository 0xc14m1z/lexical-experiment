import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

export function ContentEditable() {
  const element = useRef<HTMLDivElement>(null);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setRootElement(element.current);
  }, [element.current]);

  return (
    <div
      contentEditable
      ref={element}
      className="bg-white border rounded p-4"
    />
  );
}
