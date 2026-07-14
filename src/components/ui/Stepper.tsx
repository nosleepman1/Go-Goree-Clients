import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ value, onChange, min = 0, max = 20 }: StepperProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.inputBg,
          opacity: value <= min ? 0.4 : 1,
        }}
      >
        <Ionicons name="remove" size={16} color={colors.textDark} />
      </Pressable>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.textDark,
          minWidth: 16,
          textAlign: "center",
          marginHorizontal: 14,
        }}
      >
        {value}
      </Text>
      <Pressable
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          opacity: value >= max ? 0.4 : 1,
        }}
      >
        <Ionicons name="add" size={16} color={colors.white} />
      </Pressable>
    </View>
  );
}
