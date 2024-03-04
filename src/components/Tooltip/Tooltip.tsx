import { HTMLAttributes, PropsWithChildren } from "react";

import styles from "./Tooltip.module.scss";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  visible: boolean;
}

const Tooltip = (props: Props) => {
  const { children, visible, style } = props;
  if (!visible) {
    return <></>;
  }
  return (
    <strong className={styles.tooltip} style={style}>
      <span className="material-symbols-outlined">lightbulb</span>
      {children}
    </strong>
  );
};

export default Tooltip;
