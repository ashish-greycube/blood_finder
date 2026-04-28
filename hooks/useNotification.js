import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

const useNotification = (onToken) => {
  const onTokenRef = useRef(onToken);
  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);

  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    createChannel();
  }, []);

  useEffect(() => {
    async function init() {
      const granted = await requestPermission();
      if (granted) {
        const token = await messaging().getToken();
        onTokenRef.current?.(token);
      }
    }
    init();

    const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
      onTokenRef.current?.(token);
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          const link = remoteMessage?.data?.link;
          if (link) Linking.openURL(link);
        }
      });

    messaging().onMessage(async (remoteMessage) => {
      Alert.alert(JSON.stringify(remoteMessage));

      const imageUrl =
        remoteMessage.notification?.android?.imageUrl ||
        remoteMessage.notification?.imageUrl ||
        remoteMessage.notification?.image ||
        remoteMessage.data?.image ||
        null;

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          ...(imageUrl
            ? {
                style: {
                  type: AndroidStyle.BIGPICTURE,
                  picture: imageUrl,
                },
                largeIcon: imageUrl,
              }
            : {}),
        },
        ios: {
          ...(remoteMessage.notification?.apple?.imageUrl || remoteMessage.data?.image
            ? {
                attachments: [
                  {
                    url:
                      remoteMessage.notification?.apple?.imageUrl ||
                      remoteMessage.data?.image,
                  },
                ],
              }
            : {}),
        },
      });
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      const link = remoteMessage?.data?.link;
      if (link) Linking.openURL(link);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const link = remoteMessage?.data?.link;
      if (link) Linking.openURL(link);
    });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, []);
};

export default useNotification;
