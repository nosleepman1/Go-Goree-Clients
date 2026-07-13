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
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: "78%",
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
                paddingTop: 12,
                paddingBottom: 18,
              }}
            >
              {step === "time" ? (
                <Pressable
                  onPress={() => setStep("date")}
                  hitSlop={12}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.inputBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="chevron-back" size={20} color={colors.textDark} />
                </Pressable>
              ) : (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#EFF4FF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
              )}
              <View>
                <Text style={{ fontSize: 17, fontWeight: "800", color: colors.textDark }}>
                  {step === "date" ? "Choisir une date" : "Choisir un horaire"}
                </Text>
                {step === "time" && selectedDate && (
                  <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600", marginTop: 2 }}>
                    {selectedDate.label}
                  </Text>
                )}
              </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
              {step === "date" ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                  {dates.map((date) => (
                    <Pressable
                      key={date.iso}
                      onPress={() => handlePickDate(date)}
                      style={({ pressed }) => ({
                        width: "48%",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: date.isToday ? "#EFF4FF" : colors.inputBg,
                        borderWidth: 1.5,
                        borderColor: date.isToday ? colors.primary : "transparent",
                        borderRadius: 16,
                        padding: 10,
                        marginBottom: 12,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          backgroundColor: date.isToday ? colors.primary : colors.white,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "800",
                            color: date.isToday ? colors.white : colors.textDark,
                            lineHeight: 17,
                          }}
                        >
                          {date.dayNumber}
                        </Text>
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: "700",
                            color: date.isToday ? "rgba(255,255,255,0.85)" : colors.textGray,
                          }}
                        >
                          {date.monthShort}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 13, fontWeight: "700", color: colors.textDark }}
                        >
                          {date.label}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textGray, marginTop: 1 }}>
                          {date.weekday}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                  {TIME_SLOTS.map((time) => (
                    <Pressable
                      key={time}
                      onPress={() => handlePickTime(time)}
                      style={({ pressed }) => ({
                        width: "30%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        paddingVertical: 16,
                        borderRadius: 16,
                        backgroundColor: colors.inputBg,
                        borderWidth: 1.5,
                        borderColor: "transparent",
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons name="time-outline" size={18} color={colors.primary} />
                      <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textDark }}>
                        {time}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
