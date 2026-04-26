import S from "../styles/board.module.scss";
import Toolbar from "../components/Toolbar";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTool } from "../features/toolbar/toolbarSlice";
import type { RootState } from "../app/store";
import { CanvasRoot } from "../canvas/CanvasRoot";

const Board = () => {
  const { selectedTool, tools } = useSelector(
    (state: RootState) => state.toolbar
  );
  const dispatch = useDispatch();
  return (
    <div className={S.board_cnt}>
      <div className={S.board_toolbar}>
        <Toolbar
          data={tools}
          activeTool={selectedTool}
          onSelect={(o) => dispatch(setActiveTool(o))}
        />
      </div>
      <CanvasRoot />
    </div>
  );
};

export default Board;
