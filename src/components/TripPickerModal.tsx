import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { getUpcomingDates, getTimeSlots, TripDate } from "@/constants/trip";

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
  const timeSlots = selectedDate ? getTimeSlots(selectedDate.iso) : [];

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
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheet}>
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              {step === "time" ? (
                <TouchableOpacity
                  onPress={() => setStep("date")}
                  hitSlop={12}
                  activeOpacity={0.7}
                  style={styles.headerIconBtn}
                >
                  <Ionicons name="chevron-back" size={20} color={colors.textDark} />
                </TouchableOpacity>
              ) : (
                <View style={styles.headerIconBadge}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
              )}
              <View>
                <Text style={styles.headerTitle}>
                  {step === "date" ? "Choisir une date" : "Choisir un horaire"}
                </Text>
                {step === "time" && selectedDate && (
                  <Text style={styles.headerSubtitle}>{selectedDate.label}</Text>
                )}
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {step === "date"
                ? dates.map((date) => (
                    <TouchableOpacity
                      key={date.iso}
                      activeOpacity={0.7}
                      onPress={() => handlePickDate(date)}
                      style={[styles.dateRow, date.isToday && styles.dateRowToday]}
                    >
                      <View style={[styles.dateBadge, date.isToday && styles.dateBadgeToday]}>
                        <Text style={[styles.dateBadgeNum, date.isToday && styles.dateBadgeTextToday]}>
                          {date.dayNumber}
                        </Text>
                        <Text style={[styles.dateBadgeMonth, date.isToday && styles.dateBadgeTextToday]}>
                          {date.monthShort}
                        </Text>
                      </View>

                      <View style={styles.dateInfo}>
                        <Text style={styles.dateLabel}>{date.label}</Text>
                        <Text style={styles.dateWeekday}>{date.weekday}</Text>
                      </View>

                      <Ionicons name="chevron-forward" size={18} color={colors.textGray} />
                    </TouchableOpacity>
                  ))
                : (
                    <View>
                      {timeSlots.map((slot) => (
                        <TouchableOpacity
                          key={slot.time}
                          activeOpacity={0.7}
                          onPress={() => handlePickTime(slot.time)}
                          style={styles.timeRow}
                        >
                          <View style={styles.timeIconBadge}>
                            <Ionicons name="time-outline" size={18} color={colors.primary} />
                          </View>
                          <Text style={styles.timeLabel}>{slot.time}</Text>
                          <View style={styles.seatsBlock}>
                            <View style={styles.seatsRow}>
                              <View style={styles.seatsDot} />
                              <Text style={styles.seatsNum}>{slot.seatsAvailable}</Text>
                            </View>
                            <Text style={styles.seatsLabel}>places</Text>
                          </View>
                        </TouchableOpacity>
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "78%",
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  dateRowToday: {
    backgroundColor: "#EFF4FF",
    borderColor: colors.primary,
  },
  dateBadge: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateBadgeToday: {
    backgroundColor: colors.primary,
  },
  dateBadgeNum: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textDark,
    lineHeight: 18,
  },
  dateBadgeMonth: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textGray,
  },
  dateBadgeTextToday: {
    color: colors.white,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textDark,
  },
  dateWeekday: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  timeIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  timeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textDark,
  },
  seatsBlock: {
    alignItems: "flex-end",
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 4,
  },
  seatsNum: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
  },
  seatsLabel: {
    fontSize: 10,
    color: colors.textGray,
    marginTop: 2,
  },
});
