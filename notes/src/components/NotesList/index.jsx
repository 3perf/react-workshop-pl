import { memo, useCallback, useMemo, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";
import _ from "lodash";
import { startTransition } from "react";

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  // 1. This is the urgent state: it has to update right away
  const [filterInput, setFilterInput] = useState("");
  // 2. This is the non-urgent state: it can wait (for 500 ms after after I stop typing)
  const [filterValue, setFilterValue] = useState("");

  // "" → "f"
  //    → "ff"

  // const setFilterValueDebounced = useMemo(() => {
  //   return _.debounce(setFilterValue, 3000);
  // }, []);

  // debouncing:
  // +: interactions are cheaper
  // −: but only if I’m not typing when the timer fires
  // −: updates happen later
  // timer duration: chance of slow interactions vs updates happening very late

  // useTransition:
  // +: interactions are cheaper

  // doWorkFor500Ms();

  console.log("NotesList rendered", filterInput, filterValue);
  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInput}
          onChange={(value) => {
            console.log("onChange called", value);
            setFilterInput(value);
            // setFilterValueDebounced(value);
            startTransition(() => {
              setFilterValue(value);
            });
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        {Object.values(notes)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .filter(({ text }) => {
            if (!filterValue) {
              return true;
            }

            return text.toLowerCase().includes(filterValue.toLowerCase());
          })
          .map(({ id, text, date }) => (
            <NoteButtonOptimized
              key={id}
              id={id}
              text={text}
              date={date}
              filter={filterValue}
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

export default NotesList;

// GIVEN: we want to wrap things with a useCallback or a useMemo, but we can’t do that because we’re inside a loop (this breaks Rules of React)
// HOW TO SOLVE:
// 1. Take the part when I want to apply useCallback – and move it into a separate component
const NoteButtonOptimized = memo(function NoteButtonOptimized({
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
});

// 1. debouncing/throttling
// 2. are there keys on the list?
// 3. virtualization → react-virtuoso or similar
// 4. make the algorithm cheaper
// 5. wrap the expensive logic (like generateNoteHeader) with useMemo
// 6. pagination
// 7. useTransition from React 18
