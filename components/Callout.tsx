import { FaInfoCircle, FaExclamationTriangle, FaLightbulb, FaTimesCircle } from "react-icons/fa";

const CALLOUT_STYLES: Record<string, { border: string; bg: string; icon: string; Icon: React.ComponentType<{ size?: number }> }> = {
  info: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    icon: "text-blue-500",
    Icon: FaInfoCircle,
  },
  warning: {
    border: "border-yellow-400",
    bg: "bg-yellow-50",
    icon: "text-yellow-500",
    Icon: FaExclamationTriangle,
  },
  tip: {
    border: "border-green-300",
    bg: "bg-green-50",
    icon: "text-green-500",
    Icon: FaLightbulb,
  },
  danger: {
    border: "border-red-300",
    bg: "bg-red-50",
    icon: "text-red-500",
    Icon: FaTimesCircle,
  },
};

export default function Callout({
  type = "info",
  children,
}: {
  type?: string;
  children?: React.ReactNode;
}) {
  const style = CALLOUT_STYLES[type] ?? CALLOUT_STYLES.info;
  const { Icon } = style;

  return (
    <div className={`my-4 flex items-start gap-3 rounded-lg border-l-4 ${style.border} ${style.bg} px-4 py-3`}>
      <div className={`flex h-5 shrink-0 items-center ${style.icon}`}>
        <Icon size={16} />
      </div>
      <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
}
