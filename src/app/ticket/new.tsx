import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { colors, gradients } from "@/constants/theme";
import { TripPickerModal } from "@/components/TripPickerModal";
import { ROUTE, PASSENGER_TYPES, PassengerTypeId, formatFcfa, TripDate } from "@/constants/trip";

export default function NewTicketScreen() {
  const [passengerType, setPassengerType] = useState<PassengerTypeId>("adulte");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [trip, setTrip] = useState<{ date: TripDate; time: string } | null>(null);

  const selected = PASSENGER_TYPES.find((p) => p.id === passengerType)!;

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
        passengerLabel: selected.label,
        total: String(selected.price),
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
        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.label}>Départ</Text>
            <View style={styles.field}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                  marginRight: 8,
                }}
              />
              <Text style={styles.fieldText}>{ROUTE.departure}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.field}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primaryLight,
                  marginRight: 8,
                }}
              />
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
              backgroundColor: trip ? colors.inputBg : colors.primaryTint,
              borderWidth: trip ? 0 : 1,
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={trip ? colors.textGray : colors.primary}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.fieldText, !trip && { color: colors.primary }]}>
              {trip ? `${trip.date.label} • ${trip.time}` : "Choisir le voyage"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={trip ? colors.textGray : colors.primary} />
        </Pressable>

        <Text style={[styles.label, { marginBottom: 4 }]}>Passager</Text>
        <Text style={{ fontSize: 12, color: colors.textGray, marginBottom: 12 }}>
          Ce billet est valable pour 1 personne.
        </Text>

        <View style={{ marginBottom: 32 }}>
          {PASSENGER_TYPES.map((type, i) => {
            const isSelected = passengerType === type.id;
            return (
              <Pressable
                key={type.id}
                onPress={() => setPassengerType(type.id)}
                style={[
                  styles.passengerCard,
                  i < PASSENGER_TYPES.length - 1 && { marginBottom: 12 },
                  isSelected && styles.passengerCardSelected,
                ]}
              >
                <View style={[styles.passengerIcon, isSelected && styles.passengerIconSelected]}>
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={isSelected ? colors.white : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passengerLabel}>{type.label}</Text>
                  <Text style={styles.passengerPrice}>{formatFcfa(type.price)}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.textGray }}>1 billet • {selected.label}</Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textDark }}>
            {formatFcfa(selected.price)}
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
              {trip ? `Payer ${formatFcfa(selected.price)}` : "Choisir le voyage pour continuer"}
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
  passengerCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  passengerCardSelected: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  passengerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  passengerIconSelected: {
    backgroundColor: colors.primary,
  },
  passengerLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.textDark,
  },
  passengerPrice: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: colors.primary,
    marginTop: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
};
