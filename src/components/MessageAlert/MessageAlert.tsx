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
      className="bg-slate-100 border-t border-b border-slate-200 text-blue-700 px-4 py-3 my-3"
      role="alert"
    >
      <p className="font-bold text-slate-400">{name}</p>
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
};
