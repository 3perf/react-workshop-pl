import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import noteMetadataReducer from "./noteMetadataReducer";

const store = configureStore({
  reducer: combineReducers({
    users: userReducer,
    noteMetadata: noteMetadataReducer,
  }),
  preloadedState: {
    users: [
      {
        id: 1,
        name: "Alexa",
        lastActiveDate: "2024-04-01",
      },
      {
        id: 2,
        name: "Jake",
        lastActiveDate: "2024-05-04",
      },
      {
        id: 3,
        name: "Josh",
        lastActiveDate: "2024-05-01",
      },
      {
        id: 4,
        name: "Kate",
        lastActiveDate: "2023-08-04",
      },
      {
        id: 5,
        name: "Jake",
        lastActiveDate: "2023-08-04",
      },
    ],
  },
});

export default store;
