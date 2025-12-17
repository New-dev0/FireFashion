import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Chip } from 'heroui-native';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToggleTabs } from '@/components/ToggleTabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

const { height } = Dimensions.get('window');
const USER_IMAGE_KEY = '@firefashion_user_image';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Summer Floral Dress', price: '₹999', platform: 'Meesho', image: 'https://api.switchx.dev/api/mocks/images?query=dress', rating: 4.2 },
  { id: 2, name: 'Cotton T-Shirt', price: '₹499', platform: 'Myntra', image: 'https://api.switchx.dev/api/mocks/images?query=tshirt', rating: 4.5 },
  { id: 3, name: 'Denim Jeans', price: '₹1299', platform: 'Flipkart', image: 'https://api.switchx.dev/api/mocks/images?query=jeans', rating: 4.3 },
  { id: 4, name: 'Running Shoes', price: '₹2499', platform: 'Amazon', image: 'https://api.switchx.dev/api/mocks/images?query=shoes', rating: 4.7 },
  { id: 5, name: 'Ethnic Kurta Set', price: '₹1499', platform: 'Meesho', image: 'https://api.switchx.dev/api/mocks/images?query=kurta', rating: 4.1 },
  { id: 6, name: 'Formal Shirt', price: '₹899', platform: 'Myntra', image: 'https://api.switchx.dev/api/mocks/images?query=shirt', rating: 4.4 },
];

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState<'search' | 'vault'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [userImage, setUserImage] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const platforms = ['All', 'Meesho', 'Myntra', 'Flipkart', 'Amazon'];
  const snapPoints = useMemo(() => ['30%', '90%'], []);

  useEffect(() => {
    loadUserImage();
  }, []);

  const loadUserImage = async () => {
    try {
      const image = await AsyncStorage.getItem(USER_IMAGE_KEY);
      setUserImage(image);
    } catch (error) {
      console.error('Error loading user image:', error);
    }
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesPlatform = selectedPlatform === 'All' || product.platform === selectedPlatform;
      const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesQuery;
    });
  }, [selectedPlatform, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header with Toggle Tabs */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ToggleTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </SafeAreaView>

      {activeTab === 'search' ? (
        <>
          {/* User Image Display */}
          <View style={styles.userImageContainer}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.userImage} resizeMode="contain" />
            ) : (
              <Pressable style={styles.uploadPlaceholder} onPress={() => router.push('/camera')}>
                <View style={styles.uploadIcon}>
                  <Ionicons name="camera" size={48} color="#FACC15" />
                </View>
                <Text style={styles.uploadText}>Tap to upload your photo</Text>
              </Pressable>
            )}
          </View>

          {/* Bottom Sheet for Product Search */}
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.bottomSheetIndicator}
            enablePanDownToClose={false}
          >
            <BottomSheetScrollView
              style={styles.bottomSheetScroll}
              contentContainerStyle={styles.bottomSheetContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#FACC15" />
                <TextInput
                  placeholder="Search fashion across platforms..."
                  placeholderTextColor="#6B7280"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>

              {/* Platform Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.platformTabsScroll}
                contentContainerStyle={styles.platformTabsContainer}
              >
                {platforms.map((platform) => (
                  <Pressable
                    key={platform}
                    onPress={() => setSelectedPlatform(platform)}
                    style={[
                      styles.platformTab,
                      selectedPlatform === platform && styles.platformTabActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.platformTabText,
                        selectedPlatform === platform && styles.platformTabTextActive
                      ]}
                    >
                      {platform}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Product Results */}
              <View style={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Pressable style={styles.productCardPressable}>
                      <View style={styles.productImageContainer}>
                        <Image
                          source={{ uri: product.image }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <View style={styles.productFooter}>
                          <Text style={styles.productPrice}>{product.price}</Text>
                          <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color="#FACC15" />
                            <Text style={styles.ratingText}>{product.rating}</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                    <Pressable style={styles.tryOnButton}>
                      <Ionicons name="sparkles" size={14} color="#000" style={{ marginRight: 4 }} />
                      <Text style={styles.tryOnButtonText}>Try On</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      ) : (
        // Vault Tab
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.vaultContainer}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                  {userImage ? (
                    <Image source={{ uri: userImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Ionicons name="person" size={32} color="#FACC15" />
                    </View>
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Fashion Enthusiast</Text>
                  <Text style={styles.profileSubtitle}>FireFashion Member</Text>
                </View>
                <Pressable style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="#FACC15" />
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>24</Text>
                  <Text style={styles.statLabel}>Try-Ons</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>8</Text>
                  <Text style={styles.statLabel}>Purchased</Text>
                </View>
              </View>
            </View>

            {/* Wishlist Section */}
            <View style={styles.wishlistSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>My Wishlist 💖</Text>
                <Pressable>
                  <Text style={styles.seeAllLink}>See All</Text>
                </Pressable>
              </View>

              <View style={styles.wishlistGrid}>
                {filteredProducts.slice(0, 4).map((product) => (
                  <View key={product.id} style={styles.wishlistCard}>
                    <Pressable style={styles.wishlistCardPressable}>
                      <View style={styles.wishlistImageContainer}>
                        <Image
                          source={{ uri: product.image }}
                          style={styles.wishlistImage}
                          resizeMode="cover"
                        />
                        <Pressable style={styles.heartButton}>
                          <Ionicons name="heart" size={18} color="#FACC15" />
                        </Pressable>
                      </View>
                      <View style={styles.wishlistInfo}>
                        <Text style={styles.wishlistName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <Text style={styles.wishlistPrice}>{product.price}</Text>
                        <Text style={styles.wishlistPlatform}>{product.platform}</Text>
                      </View>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Try-Ons Section */}
            <View style={styles.recentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>Recent Try-Ons ✨</Text>
                <Pressable>
                  <Text style={styles.seeAllLink}>See All</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentScroll}
              >
                {['outfit', 'fashion', 'style', 'clothing'].map((query, index) => (
                  <View key={index} style={styles.recentCard}>
                    <Pressable style={styles.recentImageContainer}>
                      <Image
                        source={{ uri: `https://api.switchx.dev/api/mocks/images?query=${query}` }}
                        style={styles.recentImage}
                        resizeMode="cover"
                      />
                      <View style={styles.recentOverlay}>
                        <Ionicons name="play-circle" size={32} color="#FACC15" />
                      </View>
                    </Pressable>
                    <Text style={styles.recentDate}>2 days ago</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  userImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  uploadIcon: {
    backgroundColor: '#18181B',
    borderRadius: 100,
    padding: 32,
    marginBottom: 16,
  },
  uploadText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'System',
  },
  bottomSheetBackground: {
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: '#FACC15',
    width: 50,
    height: 5,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  bottomSheetContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'System',
    padding: 0,
  },
  platformTabsScroll: {
    marginBottom: 16,
  },
  platformTabsContainer: {
    paddingRight: 20,
    gap: 10,
  },
  platformTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  platformTabActive: {
    backgroundColor: '#FACC15',
    borderColor: '#FACC15',
  },
  platformTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  platformTabTextActive: {
    color: '#000',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#18181B',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  productCardPressable: {
    width: '100%',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
    fontFamily: 'System',
    minHeight: 38,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FACC15',
    fontFamily: 'System',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  tryOnButton: {
    backgroundColor: '#FACC15',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    marginTop: 0,
  },
  tryOnButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  vaultContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    fontFamily: 'System',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FACC15',
    marginBottom: 4,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#27272A',
  },
  wishlistSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'System',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#FACC15',
    fontWeight: '600',
    fontFamily: 'System',
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  wishlistCard: {
    width: '48%',
    backgroundColor: '#18181B',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  wishlistCardPressable: {
    width: '100%',
  },
  wishlistImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  wishlistImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistInfo: {
    padding: 10,
  },
  wishlistName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 6,
    fontFamily: 'System',
    minHeight: 36,
  },
  wishlistPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FACC15',
    marginBottom: 4,
    fontFamily: 'System',
  },
  wishlistPlatform: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'System',
  },
  recentSection: {
    marginBottom: 20,
  },
  recentScroll: {
    gap: 12,
    paddingRight: 20,
  },
  recentCard: {
    width: 120,
  },
  recentImageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 8,
    position: 'relative',
  },
  recentImage: {
    width: '100%',
    height: '100%',
  },
  recentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  recentDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
