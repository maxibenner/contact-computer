import { createContext, ReactElement, useState } from "react";

export type Notification = {
  title: string;
  description: string | ReactElement;
  type: "error" | "info";
  buttonText?: string;
  doNotShowAgainId?: string;
};

export const NotificationContext = createContext<
  [
    Notification | null,
    (data: Notification | null) => void,
    boolean,
    () => void
  ]
>([] as any);

export const NotificationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification_internal] =
    useState<Notification | null>(null);
  const [doNotShowAgain, setDoNotShowAgain_internal] = useState(false);

  // Toggle doNotShowAgain
  const setDoNotShowAgain = () => setDoNotShowAgain_internal((prev) => !prev);

  // Choose between request and cancel notification
  const setNotification = (data: Notification | null) => {
    if (data) addNotification(data);
    else cancelNotification();
  };

  // Route notification requests through this function to check if they can be shown
  const addNotification = (data: Notification) => {
    // Check if notification request has a doNotShowAgainId -> if not, set notification
    if (!data.doNotShowAgainId) return setNotification_internal(data);

    // If request does have a doNotShowAgainId, check if doNotShowAgainId array exists in local storage
    const notificationIdsString = localStorage.getItem("notification_ids");
    if (notificationIdsString) {
      // -> array exists, now cross-check it with the provided id
      const notificationIdsArray = JSON.parse(notificationIdsString);

      // If new id is included in the array, return function to prevent notification from appearing
      if (notificationIdsArray.includes(data.doNotShowAgainId)) return;
    }

    // Show notification
    setNotification_internal(data);
  };

  // Route cancel request through this function to check if this notification will be shown the next time
  const cancelNotification = () => {
    // Double check if notification is set before continuing
    if (!notification) return;

    // Check if do not show again has been checked
    // -> Not checked
    if (!doNotShowAgain || !notification.doNotShowAgainId)
      return setNotification_internal(null);

    // -> Checked, add id to doNotShowAgainId array in local storage
    const notificationIdsString = localStorage.getItem("notification_ids");

    // Check if object in local storage exists, if not, create it
    if (notificationIdsString) {
      // -> Object exists, now push id to it
      const notificationIdsArray = JSON.parse(notificationIdsString);
      const notificationIdsArrayWithNewId = [
        ...notificationIdsArray,
        notification.doNotShowAgainId,
      ];
      const notificationIdsArrayWithNewIdString = JSON.stringify(
        notificationIdsArrayWithNewId
      );
      localStorage.setItem(
        "notification_ids",
        notificationIdsArrayWithNewIdString
      );
    }

    // -> Object does not yet exists. Create it with new id
    if (notification)
      localStorage.setItem(
        "notification_ids",
        JSON.stringify([notification.doNotShowAgainId])
      );

    // Reset do not show again
    setDoNotShowAgain_internal(false);

    // Cancel notification
    return setNotification_internal(null);
  };

  return (
    <NotificationContext.Provider
      value={[notification, setNotification, doNotShowAgain, setDoNotShowAgain]}
    >
      {children}
    </NotificationContext.Provider>
  );
};
