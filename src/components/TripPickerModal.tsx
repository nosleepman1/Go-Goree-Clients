import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { getUpcomingDates, TIME_SLOTS, TripDate } from "@/constants/trip";

interface TripPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selection: { date: TripDate; time: string }) => void;
}

type Step = "date" | "time";

export function TripPickerModal({ visible, onClose, onConfirm }: TripPickerModalProps) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<TripDate | null>(null);
  const dates = getUpcomingDates(8);

  useEffect(() => {
    if (visible) {
      setStep("date");
      setSelectedDate(null);
    }
  }, [visible]);

  function handlePickDate(date: TripDate) {
    setSelectedDate(date);
    setStep("time");
  }

  function handlePickTime(time: string) {
    if (!selectedDate) return;
    onConfirm({ date: selectedDate, time });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(17,24,39,0.5)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "75%",
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 4 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              {step === "time" && (
                <Pressable onPress={() => setStep("date")} hitSlop={12} style={{ marginRight: 12 }}>
                  <Ionicons name="chevron-back" size={22} color={colors.textDark} />
                </Pressable>
              )}
              <View>
                <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textDark }}>
                  {step === "date" ? "Choisir une date" : "Choisir un horaire"}
                </Text>
                {step === "time" && selectedDate && (
                  <Text style={{ fontSize: 13, color: colors.textGray, marginTop: 2 }}>
                    {selectedDate.label}
                  </Text>
                )}
              </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              {step === "date"
                ? dates.map((date) => (
                    <Pressable
                      key={date.iso}
                      onPress={() => handlePickDate(date)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: colors.textDark }}>{date.label}</Text>
                      <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
                    </Pressable>
                  ))
                : TIME_SLOTS.map((time) => (
                    <Pressable
                      key={time}
                      onPress={() => handlePickTime(time)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text style={{ fontSize: 15, color: colors.textDark }}>{time}</Text>
                      <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
                    </Pressable>
                  ))}
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
