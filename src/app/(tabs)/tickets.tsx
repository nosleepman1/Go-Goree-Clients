import { View, Text } from "react-native";
import { colors } from "@/constants/theme";

export default function TicketsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
      <Text style={{ fontSize: 16, color: colors.textGray }}>Mes billets — à venir</Text>
    </View>
  );
}
