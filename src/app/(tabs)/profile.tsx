import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useTickets } from "@/hooks/useTickets";
import { useWallet } from "@/hooks/useWallet";
import { formatFcfa } from "@/constants/trip";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function MenuRow({
  icon,
  iconColor,
  iconBg,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: colors.textDark }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { tickets } = useTickets();
  const { balance } = useWallet();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.white }}>
              {user ? initials(user.name) : "?"}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textDark }}>
            {user?.name ?? "Utilisateur"}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textGray, marginTop: 2 }}>
            {user?.email ?? ""}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.inputBg,
            borderRadius: 18,
            padding: 16,
            marginBottom: 28,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.textDark }}>
              {tickets.length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textGray, marginTop: 2 }}>
              Billet{tickets.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.textDark }}>
              {formatFcfa(balance)}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textGray, marginTop: 2 }}>
              Solde wallet
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textGray, marginBottom: 4 }}>
          COMPTE
        </Text>
        <MenuRow
          icon="notifications-outline"
          iconColor={colors.primary}
          iconBg="#EFF4FF"
          label="Notifications"
          onPress={() => router.push("/notifications")}
        />
        <MenuRow
          icon="settings-outline"
          iconColor={colors.primary}
          iconBg="#EFF4FF"
          label="Réglages"
          onPress={() => router.push("/settings")}
        />
        <MenuRow
          icon="ticket-outline"
          iconColor={colors.primary}
          iconBg="#EFF4FF"
          label="Mes billets"
          onPress={() => router.push("/(tabs)/tickets")}
        />
        <MenuRow
          icon="wallet-outline"
          iconColor={colors.primary}
          iconBg="#EFF4FF"
          label="Wallet"
          onPress={() => router.push("/(tabs)/wallet")}
        />

        <Pressable
          onPress={handleLogout}
          style={{
            marginTop: 32,
            height: 52,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: "#FECACA",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#DC2626" }}>
            Se déconnecter
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
