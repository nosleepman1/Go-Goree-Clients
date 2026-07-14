import { useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";

type NotificationItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

// TODO: remplacer par les notifications réelles renvoyées par l'API.
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    icon: "checkmark-circle",
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
    title: "Billet confirmé",
    message: "Votre billet Dakar ↔ Île de Gorée a été généré avec succès.",
    time: "Il y a 2h",
    read: false,
  },
  {
    id: "2",
    icon: "boat",
    iconColor: colors.primary,
    iconBg: colors.primaryTint,
    title: "Départ imminent",
    message: "Votre chaloupe part dans 30 minutes. Présentez votre QR Code à l'embarquement.",
    time: "Il y a 5h",
    read: false,
  },
  {
    id: "3",
    icon: "wallet",
    iconColor: colors.primary,
    iconBg: colors.primaryTint,
    title: "Portefeuille rechargé",
    message: "Votre wallet a été crédité de 20 000 FCFA via Orange Money.",
    time: "Hier",
    read: true,
  },
  {
    id: "4",
    icon: "pricetag",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    title: "Offre spéciale",
    message: "-10% sur votre prochaine traversée ce week-end.",
    time: "Il y a 2 jours",
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <Pressable onPress={() => router.canGoBack() && router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.textDark} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textDark, marginLeft: 12 }}>
          Notifications
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markAsRead(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              backgroundColor: item.read ? colors.white : colors.primaryTint,
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: item.read ? colors.border : colors.primaryLight,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.iconBg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name={item.icon} size={18} color={item.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: "700", color: colors.textDark }}>
                  {item.title}
                </Text>
                {!item.read && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.primary,
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 13, color: colors.textGray, marginBottom: 6, lineHeight: 18 }}>
                {item.message}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textGray }}>{item.time}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ fontSize: 14, color: colors.textGray, textAlign: "center", marginTop: 40 }}>
            Aucune notification pour l'instant.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
