import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { colors, gradients } from "@/constants/theme";
import { Stepper } from "@/components/ui/Stepper";
import { TripPickerModal } from "@/components/TripPickerModal";
import { ROUTE, ADULT_PRICE, CHILD_PRICE, formatFcfa, TripDate } from "@/constants/trip";

const AVAILABLE_SEATS = 150;

export default function TicketsScreen() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [trip, setTrip] = useState<{ date: TripDate; time: string } | null>(null);

  const total = adults * ADULT_PRICE + children * CHILD_PRICE;
  const passengers = adults + children;

  function handleConfirmTrip(selection: { date: TripDate; time: string }) {
    setTrip(selection);
    setPickerVisible(false);
  }

  function handlePay() {
    if (!trip) {
      setPickerVisible(true);
      return;
    }
    router.push({
      pathname: "/ticket/payment",
      params: {
        adults: String(adults),
        children: String(children),
        total: String(total),
        date: `${trip.date.label} • ${trip.time}`,
      },
    });
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
          Acheter un billet (Aller-Retour)
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Départ</Text>
            <View style={styles.field}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
              <Text style={styles.fieldText}>{ROUTE.departure}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.field}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryLight }} />
              <Text style={styles.fieldText}>{ROUTE.destination}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Voyage</Text>
        <Pressable
          onPress={() => setPickerVisible(true)}
          style={[
            styles.field,
            {
              marginBottom: 24,
              justifyContent: "space-between",
              backgroundColor: trip ? colors.inputBg : "#EFF4FF",
              borderWidth: trip ? 0 : 1,
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={trip ? colors.textGray : colors.primary}
            />
            <Text
              style={[
                styles.fieldText,
                !trip && { color: colors.primary },
              ]}
            >
              {trip ? `${trip.date.label} • ${trip.time}` : "Choisir le voyage"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={trip ? colors.textGray : colors.primary} />
        </Pressable>

        <Text style={[styles.label, { marginBottom: 12 }]}>Passagers</Text>

        <View style={styles.passengerRow}>
          <Text style={{ fontSize: 15, color: colors.textDark }}>Adulte</Text>
          <Stepper value={adults} onChange={setAdults} min={1} />
        </View>
        <View style={[styles.passengerRow, { marginBottom: 20 }]}>
          <Text style={{ fontSize: 15, color: colors.textDark }}>Enfant</Text>
          <Stepper value={children} onChange={setChildren} min={0} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 32 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" }} />
          <Text style={{ fontSize: 13, color: colors.textGray }}>
            {AVAILABLE_SEATS} places disponibles
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.textGray }}>
            {passengers} passager{passengers > 1 ? "s" : ""}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textDark }}>
            {formatFcfa(total)}
          </Text>
        </View>

        <Pressable onPress={handlePay}>
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.white }}>
              {trip ? `Payer ${formatFcfa(total)}` : "Choisir le voyage pour continuer"}
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <TripPickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleConfirmTrip}
      />
    </SafeAreaView>
  );
}

const styles = {
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.textGray,
    marginBottom: 6,
  },
  field: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  fieldText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textDark,
  },
  passengerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
};
