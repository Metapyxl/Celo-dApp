import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          // ...MaterialIcons.font,
          // 'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'material': require('../assets/fonts/MaterialIcons.ttf'),
          // material: ("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf")
          // ionicons: require('path/to/ionicons.ttf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
