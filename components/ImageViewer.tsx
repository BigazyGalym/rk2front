import { Image, StyleSheet, View } from 'react-native';
import { type ImageSource } from 'expo-image';

interface ImageViewerProps {
  imgSource: ImageSource;
  selectedImage?: string;
  filter?: string; // New prop for filter
  frame?: string;
}

export default function ImageViewer({ imgSource, selectedImage, filter }: ImageViewerProps) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  // Define filter styles
  const filterStyles = {
    none: {},
    grayscale: { filter: 'grayscale(100%)' },
    sepia: { filter: 'sepia(100%)' },
    bright: { filter: 'brightness(150%)' },
  };

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={[styles.image, filter ? filterStyles[filter as keyof typeof filterStyles] : {}]}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
