import React from "react";

interface MessageAlertProps {
  name: string;
  message: string;
}

export const MessageAlert: React.FC<MessageAlertProps> = ({
  name,
  message,
}) => {
  return (
    <div
      className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg shadow-md p-4 my-4 animate-slide-in"
      role="alert"
    >
      <p className="font-semibold text-green-700">{name}</p>
      <p className="text-sm text-blue-600">{message}</p>
    </div>
  );
};
