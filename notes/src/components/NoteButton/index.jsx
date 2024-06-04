import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { format } from "date-fns";
import "./index.css";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";

// const Button = styled.button`
//   color: red;
// `;

function NoteButton({ isActive, onNoteActivated, id, text, filterText, date }) {
  const noteHeader = useRef();
  const [isOverflowing, setIsOverflowing] = useState(false);

  // 1. render NoteButtons
  // 2. you’d run 100 useLayoutEffects in a row → they’ll do all the reading (but no writing)
  // 3. rerender the updated NoteButtons → that will do the writing

  useLayoutEffect(() => {
    if (noteHeader.current) {
      if (noteHeader.current.scrollWidth > noteHeader.current.clientWidth) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }

    // setButton(Button);
    // → no DOM writing here
  }, [text]);

  // useLayoutEffect(() => {
  //   if (noteHeader.current) {
  //     if (noteHeader.current.scrollWidth > noteHeader.current.clientWidth) {
  //       requestAnimationFrame(() => {
  //         noteHeader.current.classList.add(
  //           "notes-list__note-header_overflowing"
  //         );
  //       });
  //     } else {
  //       requestAnimationFrame(() => {
  //         noteHeader.current.classList.remove(
  //           "notes-list__note-header_overflowing"
  //         );
  //       });
  //     }
  //   }
  // }, [text]);

  // 1. always keep the overflow fade-out visible
  // 2. [replace with a CSS-only solution] replace with CSS container queries?
  // 3. [replace with a CSS-only solution] text-overflow: ellipsis
  // 4. [separate writes from reads in time: instead of read → write → read → write → ...,
  // read read read → write write write, or
  // write write write → read read read]
  // or use requestAnimationFrame to move writes to later

  const className = [
    "notes-list__button",
    "notes-list__note",
    isActive && "notes-list__note_active",
  ]
    .filter((i) => i !== false)
    .join(" ");

  return (
    <button className={className} onClick={() => onNoteActivated(id)}>
      <span className="notes-list__note-meta">
        {format(date, "d MMM yyyy")}
      </span>
      <span
        className={`notes-list__note-header ${
          isOverflowing ? "notes-list__note-header_overflowing" : ""
        }`}
        ref={noteHeader}
      >
        {generateNoteHeader(text, filterText)}
      </span>
    </button>
  );
}

function generateNoteHeader(text, filterText) {
  let firstLine = text
    .split("\n")
    .map((i) => i.trim())
    .filter((i) => i.length > 0)[0];

  // Wrap the filter text with a `<mark>` tag.
  // (The algorithm below is a bit buggy: if the note itself has any `~~something~~` entries,
  // they will be turned into `<mark>` as well. But this is alright for demo purposes.)
  let componentsMapping = {};
  if (
    filterText &&
    firstLine.toLowerCase().includes(filterText.toLowerCase())
  ) {
    // If `filterText` is `aa`, this splits `bbbbaacccaac` into ['bbb', 'aa', 'ccc', 'aa', 'c']
    // Based on example 2 in https://stackoverflow.com/a/25221523/1192426
    const firstLineParts = firstLine.split(
      new RegExp(
        "(" + filterText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + ")",
        "gi"
      )
    );

    // This wraps all `filterText` entries with a `del` tag.
    // ['bbb', 'aa', 'ccc', 'aa', 'c'] => ['bbb', '~~aa~~', 'ccc', '~~aa~~', 'c'] => 'bbb~~aa~~ccc~~aa~~c'
    firstLine = firstLineParts
      .map((part) => {
        if (part.toLowerCase() === filterText.toLowerCase()) {
          return `~~${part}~~`;
        }

        return part;
      })
      .join("");

    // This ensures that all `filterText` entries are actually wrapped with `mark`, not with `del`
    componentsMapping = {
      del: "mark",
    };
  }

  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      disallowedElements={["p", "h1", "h2", "h3", "h4", "h5", "h6"]}
      unwrapDisallowed={true}
      components={componentsMapping}
    >
      {firstLine}
    </ReactMarkdown>
  );
}

export default memo(NoteButton);
