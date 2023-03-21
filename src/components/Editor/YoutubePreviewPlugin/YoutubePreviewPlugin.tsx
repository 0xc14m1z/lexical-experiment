import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $dfs } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";
import { Preview, useYoutubePreviews } from "./useYoutubePreviews";

export function YoutubePreviewPlugin() {
  const [editor] = useLexicalComposerContext();
  const [previews, add, remove, trackedUrls] = useYoutubePreviews();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const urls = new Set(
          $dfs()
            .map((dfsNode) => dfsNode.node)
            .filter($isLinkNode)
            .map((node) => node.getURL())
            .filter((url) => url.includes("youtube")) // that's a shitty check to see if it's a youtube video, i know, i'm playing here
        );

        urls.forEach(add);
        trackedUrls.forEach((url) => {
          if (!urls.has(url)) {
            remove(url);
          }
        });
      });
    });
  }, [editor, add, remove]);

  return previews.length > 0 ? (
    <ul className="mt-4 grid grid-cols-4 gap-4">
      {previews.map((preview) => (
        <li key={preview.url}>
          <YoutubePreview preview={preview} />
        </li>
      ))}
    </ul>
  ) : null;
}

function YoutubePreview({ preview }: { preview: Preview }) {
  return (
    <figure className="border border-2 rounded p-1">
      <img
        alt={preview.metadata.title}
        src={preview.metadata?.thumbnailUrl}
        className="rounded-sm"
      />
      <figcaption className="mt-2 px-2 py-1 text-sm font-semibold">
        {preview.metadata?.title}
      </figcaption>
    </figure>
  );
}
