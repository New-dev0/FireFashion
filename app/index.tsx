import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_IMAGE_KEY = '@firefashion_user_image';

export default function Index() {
  const { hasSeenOnboarding, isLoading } = useOnboarding();
  const [hasUserImage, setHasUserImage] = useState<boolean | null>(null);

  useEffect(() => {
    if (hasSeenOnboarding) {
      checkUserImage();
    }
  }, [hasSeenOnboarding]);

  const checkUserImage = async () => {
    try {
      const userImage = await AsyncStorage.getItem(USER_IMAGE_KEY);
      setHasUserImage(userImage !== null);
    } catch (error) {
      console.error('Error checking user image:', error);
      setHasUserImage(false);
    }
  };

  // Show loading while checking
  if (isLoading || (hasSeenOnboarding && hasUserImage === null)) {
    return <View style={styles.container} />;
  }

  // If onboarding not complete, go to onboarding
  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  // If onboarding complete but no user image, go to camera
  if (!hasUserImage) {
    return <Redirect href="/camera" />;
  }

  // If everything is set, go to home
  return <Redirect href="/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
