import { View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { type ImageSource } from 'expo-image';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';
import FilterPicker from '@/components/FilterPicker'; // New import

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false); // New state for filter modal
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [selectedFilter, setSelectedFilter] = useState<string>('none'); // New state for filter
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const viewRef = useRef<View | null>(null);
  const webRef = useRef<HTMLDivElement | null>(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedFilter('none'); // Reset filter
    setPickedEmoji(undefined); // Reset emoji
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onFilterSelect = () => {
    setIsFilterModalVisible(true); // Show filter modal
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onFilterModalClose = () => {
    setIsFilterModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        if (viewRef.current) {
          const localUri = await captureRef(viewRef, {
            height: 440,
            quality: 1,
          });

          await MediaLibrary.saveToLibraryAsync(localUri);
          if (localUri) {
            alert('Saved!');
          }
        } else {
          console.error('viewRef.current is null');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        if (webRef.current) {
          const dataUrl = await domtoimage.toJpeg(webRef.current, {
            quality: 0.95,
            width: 320,
            height: 440,
          });

          let link = document.createElement('a');
          link.download = 'sticker-smash.jpeg';
          link.href = dataUrl;
          link.click();
        } else {
          console.error('webRef.current is null');
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        {Platform.OS === 'web' ? (
          <div ref={webRef} style={{ width: 320, height: 440 }}>
            <ImageViewer
              imgSource={PlaceholderImage}
              selectedImage={selectedImage}
              filter={selectedFilter} // Pass filter to ImageViewer
            />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </div>
        ) : (
          <View ref={viewRef} collapsable={false}>
            <ImageViewer
              imgSource={PlaceholderImage}
              selectedImage={selectedImage}
              filter={selectedFilter} // Pass filter to ImageViewer
            />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          </View>
        )}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <IconButton icon="filter" label="Filter" onPress={onFilterSelect} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <FilterPicker
        isVisible={isFilterModalVisible}
        onClose={onFilterModalClose}
        onSelectFilter={setSelectedFilter}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});