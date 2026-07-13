import { View, Text } from "react-native";
import { colors } from "@/constants/theme";

export default function WalletScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
      <Text style={{ fontSize: 16, color: colors.textGray }}>Wallet — à venir</Text>
    </View>
  );
}
