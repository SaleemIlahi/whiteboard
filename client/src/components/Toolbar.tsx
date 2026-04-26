import React from "react";
import S from "../styles/toolbar.module.scss";
import Icon from "./Icon";
import type { IconName } from "./Icon";

interface DataArr {
  id: string;
  name: string;
  icon: IconName;
}

interface ToolbarProps {
  data: DataArr[];
  activeTool: string;
  onSelect: (id: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { data, activeTool, onSelect } = props;
  return (
    <div className={S.toolbar_cnt}>
      {data.map((o) => (
        <div
          key={o.id}
          className={`${S.icon_item} ${activeTool === o.id ? S.active : ""}`}
          onClick={() => onSelect(o.id)}
        >
          <Icon n={o.icon} w={20} h={20} />
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
