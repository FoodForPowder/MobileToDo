import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Icon } from '../components/Icons';

export default function ProfileScreen({ navigation }) {
  const renderAccountItem = (index) => {
    return (
      <View key={`account-${index}`} style={styles.accountCard}>
        <View style={styles.accountAvatar}>
          <Text style={styles.accountAvatarText}>A</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>username</Text>
          <Text style={styles.accountEmail}>usermail@example.com</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Header with back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          {/* Profile section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../assets/profile-large.png')} style={styles.profileImage} />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Icon name="edit-2" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>Bob</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Icon name="edit-2" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileEmailContainer}>
                <Text style={styles.profileEmail}>Bob@example.com</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Icon name="edit-2" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Other accounts section */}
          <View style={styles.accountsSection}>
            <Text style={styles.accountsTitle}>Другие аккаунты</Text>

            {[0, 1, 2].map((index) => renderAccountItem(index))}
          </View>

          {/* Дополнительное пространство внизу для прокрутки */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Add account button */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.addAccountButton}>
            <Icon name="plus" size={20} color="#6750A4" />
            <Text style={styles.addAccountText}>Добавить аккаунт</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    // Дополнительные отступы для устройств с вырезами
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20, // Дополнительный отступ снизу для прокрутки
  },
  backButton: {
    padding: 16,
    paddingTop: 20, // Дополнительный отступ сверху
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileEmail: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  editButton: {
    padding: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E0EB',
    marginVertical: 20,
  },
  accountsSection: {
    paddingHorizontal: 16,
  },
  accountsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7ECFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  accountAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6E0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  accountInfo: {
    marginLeft: 16,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
  },
  bottomActions: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Дополнительный отступ для iOS
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E6E0EB',
    backgroundColor: '#fff',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addAccountText: {
    marginLeft: 8,
    color: '#6750A4',
    fontWeight: '500',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 20, // Дополнительное пространство внизу для прокрутки
  },
});

