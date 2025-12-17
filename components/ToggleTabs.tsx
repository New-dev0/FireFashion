import { Pressable, View, Text, StyleSheet } from 'react-native';

interface ToggleTabsProps {
  activeTab: 'search' | 'vault';
  onTabChange: (tab: 'search' | 'vault') => void;
}

export function ToggleTabs({ activeTab, onTabChange }: ToggleTabsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onTabChange('search')}
        style={[
          styles.tab,
          activeTab === 'search' ? styles.tabActive : styles.tabInactive
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'search' ? styles.tabTextActive : styles.tabTextInactive
          ]}
        >
          Search
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onTabChange('vault')}
        style={[
          styles.tab,
          activeTab === 'vault' ? styles.tabActive : styles.tabInactive
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'vault' ? styles.tabTextActive : styles.tabTextInactive
          ]}
        >
          Vault
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    padding: 4,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
  },
  tabActive: {
    backgroundColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'System',
  },
  tabTextActive: {
    color: '#000',
  },
  tabTextInactive: {
    color: '#FFF',
  },
});
