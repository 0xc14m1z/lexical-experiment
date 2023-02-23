# lexical-experiment

### experiments to perform
- [x] sort-of mention plugin, with typeahead behavior and all (stock mention plugin)
- [x] manage to import/export HTML
- [ ] ~~using react to render text nodes~~ (then text selection won't work by design)
- [ ] using react to render element nodes
- [x] using react to render void nodes (image plugin)
- [ ] reads nodes metadata from outside (useful e.g. to render link previews somewhere below the content)
- [ ] deal with nodes that need children (e.g a blockquote)

### things to further investigate
- [x] handle pasting of images from clipboard
- [ ] can dragged images be handled?
- [ ] how to read and move selection properly (useful when deleting/selecting react rendered nodes)
- [x] how to add metadata when copying to preserve nodes