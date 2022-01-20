import { createContext, useState } from "react";

export type Notification = {
  title: string;
  description: string;
  type: "error" | "info";
  buttonText?: string;
  // onClick?: Function;
};

export const NotificationContext = createContext<
  [Notification | null, Function]
>([] as any);

export const NotificationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      {children}
    </NotificationContext.Provider>
  );
};
