import React from "react";

interface MessageAlertProps {
  name: string;
  message: string;
  theme: "light" | "dark";
}

export const MessageAlert: React.FC<MessageAlertProps> = ({
  name,
  message,
  theme,
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`${
        isDark
          ? "bg-gray-800 border-gray-600 text-gray-100"
          : "bg-blue-50 border-blue-200 text-blue-900"
      } rounded-lg shadow-md p-4 my-4 animate-slide-in`}
      role="alert"
    >
      <p
        className={`${
          isDark ? "text-green-300" : "text-green-700"
        } font-semibold`}
      >
        {name}
      </p>
      <p className={`${isDark ? "text-blue-400" : "text-blue-600"} text-sm`}>
        {message}
      </p>
    </div>
  );
};
