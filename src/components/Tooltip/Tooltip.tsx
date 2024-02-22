import { PropsWithChildren } from "react";

import styles from "./Tooltip.module.scss";

interface Props extends PropsWithChildren {
  visible: boolean;
}

const Tooltip = (props: Props) => {
  const { children, visible } = props;
  if (!visible) {
    return <></>;
  }
  return (
    <strong className={styles.tooltip}>
      <span className="material-symbols-outlined">lightbulb</span>
      {children}
    </strong>
  );
};

export default Tooltip;
