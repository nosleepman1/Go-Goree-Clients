import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  AppState,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { colors, gradients } from "@/constants/theme";
import { usePortefeuille } from "@/hooks/usePortefeuille";
import { portefeuilleService, RechargeMode } from "@/services/portefeuille.service";
import { formatFcfa } from "@/constants/trip";
import { formatApiError } from "@/utils/apiError";
import { RechargeModal } from "@/components/RechargeModal";

const QUICK_AMOUNTS = [2000, 5000, 10000, 20000];
const RECHARGE_POLL_MS = 3000;
const RECHARGE_TIMEOUT_MS = 60_000;

const RECHARGE_MODE_MAP: Record<"wave" | "orange" | "yas", RechargeMode> = {
  wave: "WAVE",
  orange: "ORANGE_MONEY",
  yas: "YAS",
};

type PendingRecharge = {
  previousSolde: number;
  startedAt: number;
};

export default function WalletScreen() {
  const { data: portefeuille, isLoading, isError, refetch, isRefetching } = usePortefeuille();
  const [modalVisible, setModalVisible] = useState(false);
  const [presetAmount, setPresetAmount] = useState<number | null>(null);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [rechargeError, setRechargeError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingRecharge | null>(null);
  const [justCredited, setJustCredited] = useState(false);
  const rechargingRef = useRef(false);

  const balance = portefeuille ? Number(portefeuille.solde) : null;
  const pendingTimedOut = pending !== null && Date.now() - pending.startedAt > RECHARGE_TIMEOUT_MS;

  // La recharge n'est créditée que lorsque le webhook Paydunya est traité côté
  // backend : on observe le solde jusqu'à ce qu'il bouge.
  useEffect(() => {
    if (!pending || pendingTimedOut) return;
    const interval = setInterval(() => refetch(), RECHARGE_POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, pendingTimedOut]);

  useEffect(() => {
    if (!pending) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refetch();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  useEffect(() => {
    if (pending && balance !== null && balance !== pending.previousSolde) {
      setPending(null);
      setJustCredited(true);
      const timer = setTimeout(() => setJustCredited(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [balance, pending]);

  async function handleConfirmRecharge(amount: number, methodId: string) {
    if (rechargingRef.current) return;
    rechargingRef.current = true;
    setRechargeError(null);
    setModalVisible(false);
    try {
      const mode = RECHARGE_MODE_MAP[methodId as "wave" | "orange" | "yas"] ?? "PAYDUNYA";
      const { redirectUrl } = await portefeuilleService.recharge(amount, mode);
      setPending({ previousSolde: balance ?? 0, startedAt: Date.now() });
      if (redirectUrl) {
        await WebBrowser.openBrowserAsync(redirectUrl);
        refetch();
      }
    } catch (err) {
      setRechargeError(formatApiError(err));
      setPending(null);
    } finally {
      rechargingRef.current = false;
    }
  }

  function openRecharge(amount: number | null) {
    setPresetAmount(amount);
    setModalVisible(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.white, marginBottom: 20 }}>
              Mon portefeuille
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                  color: "rgba(255,255,255,0.8)",
                  marginRight: 8,
                }}
              >
                SOLDE DISPONIBLE
              </Text>
              <Pressable onPress={() => setBalanceHidden((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={balanceHidden ? "eye-off-outline" : "eye-outline"}
                  size={15}
                  color="rgba(255,255,255,0.8)"
                />
              </Pressable>
            </View>

            {isLoading ? (
              <View style={{ height: 40, justifyContent: "center", marginBottom: 20 }}>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : (
              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.white, marginBottom: 20 }}>
                {isError || balance === null
                  ? "— FCFA"
                  : balanceHidden
                    ? "•••• FCFA"
                    : formatFcfa(balance)}
              </Text>
            )}

            <Pressable onPress={() => openRecharge(null)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.22)",
                  borderRadius: 26,
                  height: 48,
                }}
              >
                <Ionicons name="add" size={18} color={colors.white} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.white }}>
                  Recharger
                </Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        {isError ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FEE2E2",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <Ionicons name="alert-circle" size={20} color="#DC2626" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 13, color: "#991B1B" }}>
              Impossible de charger votre portefeuille. Tirez pour réessayer.
            </Text>
          </View>
        ) : null}

        {rechargeError ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FEE2E2",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <Ionicons name="alert-circle" size={20} color="#DC2626" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 13, color: "#991B1B" }}>{rechargeError}</Text>
            <Pressable onPress={() => setRechargeError(null)} hitSlop={8}>
              <Ionicons name="close" size={18} color="#991B1B" />
            </Pressable>
          </View>
        ) : null}

        {pending ? (
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Ionicons name="time-outline" size={20} color="#D97706" style={{ marginRight: 10 }} />
              <Text style={{ flex: 1, fontSize: 13, fontWeight: "700", color: "#92400E" }}>
                {pendingTimedOut ? "Recharge toujours en attente" : "Recharge en cours de confirmation..."}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: "#92400E", marginBottom: 10 }}>
              {pendingTimedOut
                ? "Le paiement n'a pas encore été confirmé. Le solde sera crédité dès sa validation."
                : "Votre solde sera mis à jour dès que Paydunya aura confirmé le paiement."}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => refetch()}
                style={{
                  paddingHorizontal: 14,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "#D97706",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.white }}>
                  Vérifier maintenant
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPending(null)}
                style={{
                  paddingHorizontal: 14,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#92400E" }}>Masquer</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {justCredited ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#DCFCE7",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, fontSize: 13, fontWeight: "700", color: "#166534" }}>
              Recharge créditée !
            </Text>
          </View>
        ) : null}

        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textDark, marginBottom: 12 }}>
          Montants rapides
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 24 }}>
          {QUICK_AMOUNTS.map((value) => (
            <Pressable
              key={value}
              onPress={() => openRecharge(value)}
              style={{
                paddingHorizontal: 16,
                height: 38,
                borderRadius: 19,
                borderWidth: 1.5,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textDark }}>
                {formatFcfa(value)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textDark, marginBottom: 4 }}>
          Dernières transactions
        </Text>
        {/* Le backend n'expose pas encore l'historique des mouvements du
            portefeuille (GET /portefeuille ne renvoie que le solde). */}
        <Text style={{ fontSize: 14, color: colors.textGray, marginTop: 8 }}>
          L'historique des transactions sera bientôt disponible.
        </Text>
      </ScrollView>

      <RechargeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmRecharge}
        initialAmount={presetAmount}
      />
    </View>
  );
}
