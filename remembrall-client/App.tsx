import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { registerForPushNotificationsAsync, Notifications } from './Notifications';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | undefined ) => token ? setExpoPushToken(token) : null); 

    // This listener is fired whenever a notification is received while the app is foregrounded
    // @ts-ignore
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification as any);
    });

    return () => {
      // @ts-ignore
      Notifications.removeNotificationSubscription(notificationListener.current);
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
