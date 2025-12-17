import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Chip, Avatar } from 'heroui-native';
import { ScrollView, View, Text } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledIonicons = withUniwind(Ionicons);

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-12 pb-8">
        {/* Header Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-foreground mb-1">
                🔥 FireFashion
              </Text>
              <Text className="text-base text-muted">
                Try on fashion virtually, instantly
              </Text>
            </View>
            <Avatar size="lg" alt="User Avatar">
              <Avatar.Image
                source={{
                  uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
                }}
              />
              <Avatar.Fallback>FF</Avatar.Fallback>
            </Avatar>
          </View>

          {/* Status Chips */}
          <View className="flex-row gap-2 flex-wrap">
            <Chip size="sm" variant="secondary" color="danger">
              <View className="size-1.5 mr-1.5 rounded-full bg-danger" />
              <Chip.Label>Hot Deals</Chip.Label>
            </Chip>
            <Chip size="sm" variant="soft" color="warning">
              <Chip.Label>🔥 Trending Now</Chip.Label>
            </Chip>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Button variant="primary" onPress={() => console.log('Upload Photo')}>
              <StyledIonicons
                name="camera"
                size={20}
                className="text-accent-foreground"
              />
              <Button.Label>Upload Your Photo</Button.Label>
            </Button>
            <View className="flex-row gap-3">
              <Button variant="secondary" className="flex-1">
                <StyledIonicons
                  name="search"
                  size={18}
                  className="text-accent-soft-foreground"
                />
                <Button.Label>Search Items</Button.Label>
              </Button>
              <Button variant="tertiary" className="flex-1">
                <StyledIonicons
                  name="time-outline"
                  size={18}
                  className="text-default-foreground"
                />
                <Button.Label>History</Button.Label>
              </Button>
            </View>
          </View>
        </View>

        {/* Featured Cards */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Featured
          </Text>

          <Card className="mb-4">
            <View className="gap-4">
              <Card.Body>
                <View className="flex-row items-center gap-2 mb-3">
                  <Chip size="sm" variant="primary" color="accent">
                    <Chip.Label>New</Chip.Label>
                  </Chip>
                  <Chip size="sm" variant="soft" color="warning">
                    <StyledIonicons name="star" size={12} className="text-yellow-500" />
                    <Chip.Label>Premium</Chip.Label>
                  </Chip>
                </View>
                <Card.Title>HeroUI Native</Card.Title>
                <Card.Description>
                  Build beautiful React Native apps with pre-built components
                  and Tailwind CSS styling.
                </Card.Description>
              </Card.Body>
              <Card.Footer className="gap-3">
                <Button variant="primary" size="sm">
                  <Button.Label>Learn More</Button.Label>
                  <StyledIonicons
                    name="arrow-forward"
                    size={16}
                    className="text-accent-foreground"
                  />
                </Button>
                <Button variant="ghost" size="sm">
                  <StyledIonicons
                    name="bookmark-outline"
                    size={16}
                    className="text-muted"
                  />
                  <Button.Label>Save</Button.Label>
                </Button>
              </Card.Footer>
            </View>
          </Card>

          <Card variant="secondary">
            <View className="gap-4">
              <Card.Body>
                <Card.Title>Uniwind Integration</Card.Title>
                <Card.Description>
                  Seamlessly integrated with Uniwind for the fastest Tailwind
                  bindings in React Native.
                </Card.Description>
              </Card.Body>
              <Card.Footer>
                <Button variant="tertiary" size="sm" className="self-start">
                  <StyledIonicons
                    name="code-slash"
                    size={14}
                    className="text-default-foreground"
                  />
                  <Button.Label>View Docs</Button.Label>
                </Button>
              </Card.Footer>
            </View>
          </Card>
        </View>

        {/* Stats Section */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Your Stats
          </Text>
          <View className="flex-row gap-3">
            <Card variant="tertiary" className="flex-1">
              <View className="gap-2 items-center py-2">
                <StyledIonicons
                  name="folder-outline"
                  size={24}
                  className="text-accent"
                />
                <Text className="text-2xl font-bold text-foreground">12</Text>
                <Text className="text-sm text-muted">Projects</Text>
              </View>
            </Card>
            <Card variant="tertiary" className="flex-1">
              <View className="gap-2 items-center py-2">
                <StyledIonicons
                  name="checkmark-circle-outline"
                  size={24}
                  className="text-success"
                />
                <Text className="text-2xl font-bold text-foreground">8</Text>
                <Text className="text-sm text-muted">Completed</Text>
              </View>
            </Card>
            <Card variant="tertiary" className="flex-1">
              <View className="gap-2 items-center py-2">
                <StyledIonicons
                  name="time-outline"
                  size={24}
                  className="text-warning"
                />
                <Text className="text-2xl font-bold text-foreground">4</Text>
                <Text className="text-sm text-muted">Pending</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Team Section */}
        <View>
          <Text className="text-xl font-semibold text-foreground mb-4">
            Team Members
          </Text>
          <Card variant="quaternary">
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Avatar size="md" alt="Team Member 1">
                    <Avatar.Image
                      source={{
                        uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
                      }}
                    />
                    <Avatar.Fallback>TM</Avatar.Fallback>
                  </Avatar>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      Sarah Johnson
                    </Text>
                    <Text className="text-sm text-muted">Lead Designer</Text>
                  </View>
                </View>
                <Chip size="sm" variant="secondary" color="success">
                  <View className="size-1.5 mr-1.5 rounded-full bg-success" />
                  <Chip.Label>Active</Chip.Label>
                </Chip>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Avatar size="md" alt="Team Member 2">
                    <Avatar.Image
                      source={{
                        uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=20',
                      }}
                    />
                    <Avatar.Fallback>TM</Avatar.Fallback>
                  </Avatar>
                  <View>
                    <Text className="text-base font-medium text-foreground">
                      Mike Chen
                    </Text>
                    <Text className="text-sm text-muted">Developer</Text>
                  </View>
                </View>
                <Chip size="sm" variant="secondary" color="default">
                  <View className="size-1.5 mr-1.5 rounded-full bg-muted" />
                  <Chip.Label>Away</Chip.Label>
                </Chip>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
