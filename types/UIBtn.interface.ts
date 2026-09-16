export interface UIBtnProps {
  text: string;
  icon?: React.ReactNode;
  btnStyle?: string;
  onClick?: React.MouseEventHandler<Element>;
  to?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  disabled?: boolean;
}
