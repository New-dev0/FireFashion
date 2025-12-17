import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  Image,
  ViewToken,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useOnboarding } from '@/hooks/useOnboarding';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  content: React.ReactNode;
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useOnboarding();

  const slides: Slide[] = [
    {
      id: '1',
      content: (
        <View style={styles.slideContainer}>
          {/* Floating cards background */}
          <Animated.View
            entering={FadeIn.delay(100).duration(800)}
            style={[styles.floatingCard, styles.floatingCard1]}
          >
            <Text style={styles.emoji24}>👗</Text>
          </Animated.View>
          <Animated.View
            entering={FadeIn.delay(200).duration(800)}
            style={[styles.floatingCard, styles.floatingCard2]}
          >
            <Text style={styles.emoji24}>👟</Text>
          </Animated.View>
          <Animated.View
            entering={FadeIn.delay(300).duration(800)}
            style={[styles.floatingCard, styles.floatingCard3]}
          >
            <Text style={styles.emoji24}>👕</Text>
          </Animated.View>
          <Animated.View
            entering={FadeIn.delay(400).duration(800)}
            style={[styles.floatingCard, styles.floatingCard4]}
          >
            <Text style={styles.emoji24}>👔</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(500).duration(700)}
            style={styles.contentCard}
          >
            <Animated.View
              entering={ZoomIn.delay(300).springify()}
              style={styles.logoWrapperInCard}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            <Text style={styles.brandTitle}>
              FireFashion
            </Text>

            <Text style={styles.mainTitle}>
              Your Style,{'\n'}Your Story
            </Text>

            <Text style={styles.subtitle}>
              Where emotion meets fashion
            </Text>

            <View style={styles.emojiRowInCard}>
              <Text style={styles.emoji32}>🔥</Text>
              <Text style={styles.emoji32}>❤️</Text>
              <Text style={styles.emoji32}>✨</Text>
            </View>
          </Animated.View>
        </View>
      ),
    },
    {
      id: '2',
      content: (
        <View style={styles.slideContainer}>
          <Animated.View
            entering={FadeInUp.delay(300).duration(700)}
            style={styles.contentCard}
          >
            <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.emojiWrapper}>
              <Text style={styles.emoji64}>🎯</Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.heroTitle}
            >
              Two Superpowers,{'\n'}One App
            </Animated.Text>

            <View style={styles.featuresListContainer}>
              <Animated.View
                entering={FadeInUp.delay(500).duration(600)}
                style={styles.featureRow}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureEmoji}>🔍</Text>
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureRowTitle}>Search Anywhere</Text>
                  <Text style={styles.featureRowSubtitle}>
                    5 platforms, one search
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(650).duration(600)}
                style={styles.featureRow}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureEmoji}>✨</Text>
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureRowTitle}>Virtual Try-On</Text>
                  <Text style={styles.featureRowSubtitle}>
                    AI-powered magic
                  </Text>
                </View>
              </Animated.View>
            </View>

            <Animated.Text
              entering={FadeIn.delay(800).duration(600)}
              style={styles.highlight}
            >
              Everything you need, nothing you don't
            </Animated.Text>
          </Animated.View>
        </View>
      ),
    },
    {
      id: '3',
      content: (
        <View style={styles.slideContainer}>
          <Animated.View
            entering={FadeInUp.delay(300).duration(700)}
            style={styles.contentCard}
          >
            <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.emojiWrapper}>
              <Text style={styles.emoji64}>🔥</Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.heroTitle}
            >
              One Search,{'\n'}Everywhere
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(600).duration(600)}
              style={styles.platforms}
            >
              Amazon • Flipkart • Myntra • Ajio • Meesho
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(800).duration(600)}
              style={styles.highlight}
            >
              All in one place, instantly
            </Animated.Text>
          </Animated.View>
        </View>
      ),
    },
    {
      id: '4',
      content: (
        <View style={styles.slideContainer}>
          <Animated.View
            entering={FadeInUp.delay(300).duration(700)}
            style={styles.contentCard}
          >
            <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.emojiWrapper}>
              <Text style={styles.emoji64}>✨</Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.heroTitle}
            >
              See It On You,{'\n'}Before You Buy
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(600).duration(600)}
              style={styles.platforms}
            >
              AI-powered virtual try-on
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(800).duration(600)}
              style={styles.highlight}
            >
              Your photo + Any outfit = Magic
            </Animated.Text>
          </Animated.View>
        </View>
      ),
    },
    {
      id: '5',
      content: (
        <View style={styles.slideContainer}>
          <Animated.View
            entering={FadeInUp.delay(300).duration(700)}
            style={styles.contentCard}
          >
            <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.logoWrapperInCard}>
              <View style={styles.logoContainerFinal}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(400).duration(600)}
              style={styles.heroTitle}
            >
              Ready to Transform{'\n'}Your Shopping?
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(600).duration(600)}
              style={styles.platforms}
            >
              🔥 + ❤️
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(800).duration(600)}
              style={styles.highlightSpaced}
            >
              Fashion • Emotion • Growth
            </Animated.Text>

            <Animated.Text entering={FadeIn.delay(1000).duration(600)} style={styles.emoji48}>
              ❤️
            </Animated.Text>
          </Animated.View>
        </View>
      ),
    },
  ];

  const handleNext = async () => {
    console.log('Next button pressed, current index:', currentIndex);

    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      try {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      } catch (error) {
        console.error('Scroll error:', error);
        // Fallback: scroll by offset
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
      }
    } else {
      console.log('Completing onboarding...');
      await completeOnboarding();
      router.replace('/home');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/home');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <View style={{ width, height: height - 200 }}>{item.content}</View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        bounces={false}
        scrollEnabled={true}
        removeClippedSubviews={false}
      />

      {/* Bottom Section */}
      <SafeAreaView edges={['bottom']} style={styles.bottomSection} pointerEvents="box-none">
        <View style={styles.bottomContent} pointerEvents="box-none">
          {/* Pagination Dots */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(400)}
            style={styles.pagination}
            pointerEvents="none"
          >
            {slides.map((_, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.delay(index * 50 + 400).duration(300)}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotActive : styles.dotInactive
                ]}
              />
            ))}
          </Animated.View>

          {/* Next/Get Started Button */}
          <Animated.View entering={FadeInUp.delay(500).duration(500)}>
            <Pressable
              onPress={handleNext}
              hitSlop={20}
              style={({ pressed }) => [
                styles.button,
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }
              ]}
            >
              <Text style={styles.buttonText}>
                {isLastSlide ? 'Start Your Journey 🔥' : 'Next'}
              </Text>
              {!isLastSlide && (
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#000"
                  style={{ marginLeft: 6 }}
                />
              )}
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  floatingCard: {
    position: 'absolute',
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 12,
    opacity: 0.2,
  },
  floatingCard1: {
    top: 80,
    left: 24,
  },
  floatingCard2: {
    top: 128,
    right: 32,
  },
  floatingCard3: {
    bottom: 160,
    left: 40,
  },
  floatingCard4: {
    bottom: 208,
    right: 48,
  },
  emoji24: {
    fontSize: 24,
  },
  emoji32: {
    fontSize: 36,
  },
  emoji48: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  emoji64: {
    fontSize: 64,
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logoWrapperInCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  logoContainer: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    width: 80,
    height: 80,
  },
  logoContainerFinal: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    width: 100,
    height: 100,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  contentCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderRadius: 32,
    padding: 32,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3F3F46',
    width: '95%',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FACC15',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: 'System',
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  emojiRowInCard: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  featuresListContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 24,
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
  },
  featureIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureRowTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  featureRowSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    lineHeight: 20,
  },
  emojiWrapper: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -1,
    lineHeight: 48,
  },
  platforms: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: 'System',
  },
  highlight: {
    fontSize: 14,
    color: '#FACC15',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
  highlightSpaced: {
    fontSize: 14,
    color: '#FACC15',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'System',
  },
  bottomSection: {
    backgroundColor: '#000',
  },
  bottomContent: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FACC15',
    width: 32,
  },
  dotInactive: {
    backgroundColor: '#27272A',
    width: 8,
  },
  button: {
    backgroundColor: '#FACC15',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
});
