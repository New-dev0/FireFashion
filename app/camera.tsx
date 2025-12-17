import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_IMAGE_KEY = '@firefashion_user_image';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera" size={64} color="#FACC15" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for virtual try-on
          </Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setCapturedImage(photo.uri);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const saveAndContinue = async () => {
    if (capturedImage) {
      await AsyncStorage.setItem(USER_IMAGE_KEY, capturedImage);
      router.replace('/home');
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />

        <View style={styles.previewActions}>
          <Pressable style={styles.retakeButton} onPress={retake}>
            <Ionicons name="close" size={24} color="#FFF" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </Pressable>

          <Pressable style={styles.saveButton} onPress={saveAndContinue}>
            <Ionicons name="checkmark" size={24} color="#000" />
            <Text style={styles.saveButtonText}>Use This Photo</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Take Your Photo</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Guide overlay */}
        <View style={styles.guideContainer}>
          <View style={styles.guideFrame} />
          <Text style={styles.guideText}>Position yourself in the frame</Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.controls}>
          <Pressable style={styles.galleryButton} onPress={pickImage}>
            <Ionicons name="images" size={28} color="#FFF" />
            <View style={styles.galleryBadge}>
              <Text style={styles.galleryBadgeText}>Gallery</Text>
            </View>
          </Pressable>

          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </Pressable>

          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionIcon: {
    backgroundColor: '#18181B',
    borderRadius: 100,
    padding: 32,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    fontFamily: 'System',
  },
  permissionText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'System',
  },
  permissionButton: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: 'System',
  },
  placeholder: {
    width: 48,
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  guideFrame: {
    width: 250,
    height: 350,
    borderWidth: 3,
    borderColor: '#FACC15',
    borderRadius: 24,
    borderStyle: 'dashed',
  },
  guideText: {
    marginTop: 24,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    fontFamily: 'System',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  galleryButton: {
    alignItems: 'center',
    position: 'relative',
  },
  galleryBadge: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginTop: 8,
  },
  galleryBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: 12,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewActions: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
    gap: 8,
  },
  retakeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FACC15',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    gap: 8,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
