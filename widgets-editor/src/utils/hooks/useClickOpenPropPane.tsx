import { useShowPropertyPane } from "utils/hooks/dragResizeHooks";
import { selectWidget } from "actions/widgetActions";
import {
  getCurrentWidgetId,
  getIsPropertyPaneVisible,
} from "selectors/propertyPaneSelectors";
import { useSelector } from "store";
import { AppState } from "reducers";
import { APP_MODE } from "reducers/entityReducers/appReducer";
import { getAppMode } from "selectors/applicationSelectors";
import { useStore } from "react-redux";

// Cost of useSelector:
// 1. The selector runs every time Redux state updates in any way
// 2. === (or custom equality function)

export const useClickOpenPropPane = () => {
  const showPropertyPane = useShowPropertyPane();
  const isPropPaneVisible = useSelector(getIsPropertyPaneVisible);
  const selectedWidgetId = useSelector(getCurrentWidgetId);
  const focusedWidget = useSelector(
    (state: AppState) => state.ui.widgetDragResize.focusedWidget,
  );
  // This state tells us whether a `ResizableComponent` is resizing
  const isResizing = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isResizing,
  );
  const appMode = useSelector(getAppMode);

  // This state tells us whether a `DraggableComponent` is dragging
  const isDragging = useSelector(
    (state: AppState) => state.ui.widgetDragResize.isDragging,
  );

  const store = useStore();
  const openPropertyPane = () => {
    const state = store.getState();
    const focusedWidget = (state as any).ui.widgetDragResize.focusedWidget;

    // ignore click captures if the component was resizing or dragging coz it is handled internally in draggable component
    if (isResizing || isDragging || appMode !== APP_MODE.EDIT) return;
    if (
      (!isPropPaneVisible && selectedWidgetId === focusedWidget) ||
      selectedWidgetId !== focusedWidget
    ) {
      selectWidget(focusedWidget);
      showPropertyPane(focusedWidget, undefined, true);
    }
  };
  return openPropertyPane;
};

// connect()
