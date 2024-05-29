import { Avatar, AvatarGroup } from "@mui/material";
import { useSelector, shallowEqual } from "react-redux";
import avatar1 from "./avatar1.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.jpg";
import { memo, useEffect, useRef } from "react";
import _ from "lodash";

function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

function ActiveAuthors() {
  // hook #1:
  // const activeThisMonth = useSelector((state) =>
  //   state.users.filter(
  //     (i) =>
  //       new Date(i.lastActiveDate).getFullYear() === 2024 &&
  //       new Date(i.lastActiveDate).getMonth() === 4
  //   )
  // );
  // where’s hook #5? → inside useSelector
  // what does this mean? → this means useSelector changed = returned a new value & caused the component to rerender
  // .filter() -> new [] every time
  //
  // 1) memoize the selector with reselect
  // 2) filter outside of the selector (that is, return state.users)
  // 4) use a custom comparison function (either shallowEqual or deepEqual, e.g. _.isEqual, or anything else)
  const allUsers = useSelector(
    (state) => state.users,
    // (a, b) => a === b, ← default
    // (a, b) => JSON.stringify(a) === JSON.stringify(b),
    // ⚠️ can be very expensive
    // (a, b) => _.isEqual(a, b),
    (a, b) => {
      // compare if ids changed
      return a.map((i) => i.id).join() === b.map((i) => i.id).join();
    }
  );
  const activeThisMonth = allUsers.filter(
    (i) =>
      new Date(i.lastActiveDate).getFullYear() === 2024 &&
      new Date(i.lastActiveDate).getMonth() === 4
  );

  useWhyDidYouUpdate("ActiveAuthors", { allUsers });

  // 3) split this selector into two, each returning a primitive (number, string, boolean, or null, or undefined)
  // const activeThisMonthCount = useSelector(
  //   (state) =>
  //     state.users.filter(
  //       (i) =>
  //         new Date(i.lastActiveDate).getFullYear() === 2024 &&
  //         new Date(i.lastActiveDate).getMonth() === 4
  //     ).length
  // );
  // const activeThisMonthNames = useSelector((state) =>
  //   state.users
  //     .filter(
  //       (i) =>
  //         new Date(i.lastActiveDate).getFullYear() === 2024 &&
  //         new Date(i.lastActiveDate).getMonth() === 4
  //     )
  //     .map((i) => i.name)
  //     .join(", ")
  // );

  return (
    <div className="primary-pane__authors">
      <div className="primary-pane__authors-last-active">
        {activeThisMonth.length} users active this month:{" "}
        {activeThisMonth.map((i) => i.name).join(", ")}
      </div>
      <AvatarGroup max={2}>
        <Avatar src={avatar1} />
        <Avatar src={avatar2} />
        <Avatar src={avatar3} />
      </AvatarGroup>
    </div>
  );
}

export default memo(ActiveAuthors);
