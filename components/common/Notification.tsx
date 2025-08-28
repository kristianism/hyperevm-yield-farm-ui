import React from "react";
import { ToastPosition, toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { DotLoader } from "react-spinners";

type NotificationProps = {
  content: React.ReactNode;
  status: "success" | "info" | "loading" | "error" | "warning";
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

type NotificationOptions = {
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

const ICON_STYLE =
  "w-12 h-12 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]";

const ENUM_STATUSES = {
  success: (
    <CheckCircleIcon
      className={ICON_STYLE}
      style={{
        fill: "black",
        stroke: "#1fd35e",
      }}
    />
  ),
  loading: <DotLoader color="#ffffff" size={60} speedMultiplier={1} />,
  error: (
    <ExclamationCircleIcon
      className={ICON_STYLE}
      style={{
        fill: "black",
        stroke: "#ef4444",
      }}
    />
  ),
  info: (
    <InformationCircleIcon
      className={ICON_STYLE}
      style={{
        fill: "black",
        stroke: "#3b82f6",
      }}
    />
  ),
  warning: (
    <ExclamationTriangleIcon
      className={ICON_STYLE}
      style={{
        fill: "black",
        stroke: "#facc15",
      }}
    />
  ),
};

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION: ToastPosition = "top-center";

/**
 * Custom Notification
 */
const Notification = ({
  content,
  status,
  duration = DEFAULT_DURATION,
  icon,
  position = DEFAULT_POSITION,
}: NotificationProps) => {
  return toast.custom(
    (t) => (
      <div
        className="fixed  z-50 w-screen h-screen bg-black/20 backdrop-blur-sm grid place-content-center "
        onClick={() => {
          if (status === "loading") return;
          toast.dismiss(t.id);
          toast.remove(t.id);
        }}
      >
        <div
          className="w-screen max-w-[600px] min-h-[300px] bg-gradient-to-br from-[#1fd35e]/40 to-[#1fd372]/40
            backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col justify-center gap-10 p-8 relative transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-center">
            {icon ? (
              <div className="text-9xl drop-shadow-lg">{icon}</div>
            ) : (
              ENUM_STATUSES[status]
            )}
          </div>

          <div className="text-center sm:text-2xl  text-white drop-shadow-sm">
            {content}
          </div>

          <div
            className="cursor-pointer absolute right-6 top-6 text-white hover:text-red-400 transition-transform hover:scale-125"
            onClick={() => toast.dismiss(t.id)}
          >
            <XMarkIcon
              className="w-10 h-10"
              onClick={() => toast.remove(t.id)}
            />
          </div>
        </div>
      </div>
    ),
    {
      duration: status === "loading" ? Infinity : duration,
      position,
    }
  );
};

export const notification = {
  success: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "success", ...options });
  },
  info: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "info", ...options });
  },
  warning: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "warning", ...options });
  },
  error: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "error", ...options });
  },
  loading: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "loading", ...options });
  },
  remove: (toastId: string) => {
    toast.remove(toastId);
  },
};