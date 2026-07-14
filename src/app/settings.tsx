import { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";
import { APP_NAME } from "@/constants/config";

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: "700",
        color: colors.textGray,
        marginBottom: 4,
        marginTop: 20,
      }}
    >
      {children}
    </Text>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ flex: 1, fontSize: 15, color: colors.textDark }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function LinkRow({ label, value }: { label: string; value?: string }) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ flex: 1, fontSize: 15, color: colors.textDark }}>{label}</Text>
      {value ? (
        <Text style={{ fontSize: 14, color: colors.textGray, marginRight: 6 }}>{value}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

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
          Réglages
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <SectionLabel>NOTIFICATIONS</SectionLabel>
        <ToggleRow label="Notifications push" value={pushEnabled} onValueChange={setPushEnabled} />
        <ToggleRow label="Notifications par email" value={emailEnabled} onValueChange={setEmailEnabled} />

        <SectionLabel>PRÉFÉRENCES</SectionLabel>
        <LinkRow label="Langue" value="Français" />
        <LinkRow label="Devise" value="FCFA" />

        <SectionLabel>À PROPOS</SectionLabel>
        <LinkRow label="Aide & support" />
        <LinkRow label="Conditions d'utilisation" />
        <LinkRow label="Politique de confidentialité" />

        <Text
          style={{
            fontSize: 12,
            color: colors.textGray,
            textAlign: "center",
            marginTop: 32,
          }}
        >
          {APP_NAME} • v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
