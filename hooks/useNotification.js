import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

const useNotification = () => {
  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status", authStatus);
    }
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
    requestPermission()
    if (requestPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log("token is :-", token);
        });
    } else {
      console.log("Permission not granted", authStatus);
    }

    //Check if whether an initial notification is avail
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage) {
            const link = remoteMessage?.data?.link;

            if (link) {
              Linking.openURL(link);
            }
          }
        }
      });

    messaging().onMessage(async remoteMessage => {
      Alert.alert(JSON.stringify(remoteMessage));
      // const jsonMsg = JSON.parse(remoteMessage)
      console.log(remoteMessage)

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
          // Only add BigPictureStyle if image exists
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

      if (link) {
        Linking.openURL(link);
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const link = remoteMessage?.data?.link;

      if (link) {
        Linking.openURL(link);
      }
    });

  }, []);
};

export default useNotification;