import { UIBtnProps } from "@/types/UIBtn.interface";
import Link from "next/link";

function UIBtn({
  text,
  icon,
  onClick,
  btnStyle,
  to,
  external,
  type = "button",
  ariaLabel,
  disabled=false,
}: UIBtnProps) {
  const content = (
    <span>
      {text}
      {icon && <span>{icon}</span>}
    </span>
  );

  if (to) {
    if (external) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={btnStyle}
        >
          {content}
        </a>
      );
    } else {
      return (
        <Link href={to} className={btnStyle} onClick={onClick}>
          {content}
        </Link>
      );
    }
  }
  return (
    <>
      <button
        aria-label={ariaLabel}
        disabled={disabled}
        className={`${btnStyle} cursor-pointer`}
        onClick={onClick}
        type={type}
      >
        {content}
      </button>
    </>
  );
}

export default UIBtn;
