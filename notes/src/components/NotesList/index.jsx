import { memo, useCallback, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";

// const map = new Map()

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filter, setFilter] = useState("");

  const myFunction = useCallback(() => {
    () => onNoteActivated(true, "some-string");
  }, [onNoteActivated]);

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filter}
          onChange={setFilter}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        {Object.values(notes)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .filter(({ text }) => {
            if (!filter) {
              return true;
            }

            return text.toLowerCase().includes(filter.toLowerCase());
          })
          .map(({ id, text, date }) => (
            <NoteButtonOptimized
              key={id}
              id={id}
              text={text}
              date={date}
              filter={filter}
              activeNoteId={activeNoteId}
              onNoteActivated={onNoteActivated}
            />
          ))}
      </div>

      <div className="notes-list__controls">
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
          >
            + Note
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 300 })}
          >
            + Huge
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
          >
            + 100
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onDeleteAllRequested()}
          >
            Delete all
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

// NotesList.hooks = [useCallback, ..., ...] → if the size of the array can change, React will break the app

export default NotesList;

// GIVEN: we want to wrap things with a useCallback or a useMemo, but we can’t do that because we’re inside a loop (this breaks Rules of React)
// HOW TO SOLVE:
// 1. Take the part when I want to apply useCallback – and move it into a separate component
function NoteButtonOptimized({
  id,
  text,
  date,
  filter,
  activeNoteId,
  onNoteActivated,
}) {
  // 2. Apply useCallback to the new component
  const onNoteActivatedMemo = useCallback(
    () => onNoteActivated(id),
    [id, onNoteActivated]
  );

  // 3. (Optional) Wrap the new component with memo

  return (
    <NoteButton
      key={id}
      isActive={activeNoteId === id}
      onNoteActivated={onNoteActivatedMemo}
      text={text}
      filterText={filter}
      date={date}
    />
  );
}

// Internal React code:
// NoteButtonOptimized.hooks = [useCallback]

const NoteButtonWithUseCallback = memo(function NoteButtonWithUseCallback({
  id,
  text,
  date,
  filter,
  activeNoteId,
  onNoteActivated,
}) {
  const onNoteActivatedMemo = useCallback(
    () => onNoteActivated(id),
    [id, onNoteActivated]
  );

  return (
    <NoteButton
      key={id}
      isActive={activeNoteId === id}
      onNoteActivated={onNoteActivatedMemo}
      text={text}
      filterText={filter}
      date={date}
    />
    // 1. useCallback/useMemo → doesn’t work because we’re inside a loop (and we can’t use them inside a loop)
    // 2. manual caching (with a hash map) → works (but needs manual cache eviction)
    // 3. refactor: move into a separate component
  );
});
