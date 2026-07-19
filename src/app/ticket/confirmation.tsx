import { useEffect, useState } from "react";
import { View, Text, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { colors } from "@/constants/theme";
import { PillButton } from "@/components/ui/PillButton";
import { formatFcfa } from "@/constants/trip";
import { useBilletPolling } from "@/hooks/useBilletPolling";
import { BILLETS_QUERY_KEY } from "@/hooks/useBillets";
import { mapBilletToTicket } from "@/services/billet.service";

const MAX_AUTO_POLLS = 15; // ~45s à 3s d'intervalle, ensuite bascule en vérification manuelle

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{ ticketId: string }>();
  const queryClient = useQueryClient();

  const [pollCount, setPollCount] = useState(0);
  const timedOut = pollCount >= MAX_AUTO_POLLS;

  const polling = useBilletPolling(params.ticketId, !timedOut);
  const billet = polling.data;
  const ticket = billet ? mapBilletToTicket(billet) : undefined;
  const isPending = billet?.statut === "EN_ATTENTE_PAIEMENT";

  useEffect(() => {
    if (!polling.dataUpdatedAt) return;
    setPollCount((c) => c + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling.dataUpdatedAt]);

  // Statut terminal atteint (webhook Paydunya traité) : la liste des billets
  // doit refléter le nouveau statut.
  useEffect(() => {
    if (billet && billet.statut !== "EN_ATTENTE_PAIEMENT") {
      queryClient.invalidateQueries({ queryKey: BILLETS_QUERY_KEY });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billet?.statut]);

  // Filet de sécurité : si l'utilisateur revient dans l'app (changement
  // d'onglet, retour manuel depuis le navigateur PayDunya) plutôt que via la
  // fermeture "propre" de la webview, on relance une vérification immédiate.
  useEffect(() => {
    if (!isPending) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") polling.refetch();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  if (!ticket) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 15, color: colors.textGray, textAlign: "center" }}>
            Billet introuvable.
          </Text>
          <PillButton
            label="Retour à l'accueil"
            variant="outline"
            style={{ marginTop: 20 }}
            onPress={() => router.replace("/(tabs)/home")}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
        <View style={{ flex: 1, paddingHorizontal: 28, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#FEF3C7",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons name="time-outline" size={48} color="#D97706" />
          </View>

          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textDark, marginBottom: 8, textAlign: "center" }}>
            {timedOut ? "Toujours en attente" : "Vérification du paiement..."}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textGray, textAlign: "center", marginBottom: 32 }}>
            {timedOut
              ? "La confirmation prend plus de temps que prévu. Vous pouvez vérifier manuellement, ou revenir plus tard : votre billet reste disponible dans l'onglet Billets."
              : "Nous confirmons votre paiement avec Paydunya. Cela peut prendre quelques secondes."}
          </Text>

          <View
            style={{
              width: "100%",
              backgroundColor: colors.inputBg,
              borderRadius: 18,
              padding: 20,
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark }}>
              {ticket.departure} ↔ {ticket.destination}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textGray, marginTop: 4 }}>
              {ticket.dateLabel} • {ticket.passengersLabel}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary, marginTop: 8 }}>
              {formatFcfa(ticket.total)}
            </Text>
          </View>

          <View style={{ width: "100%", marginBottom: 12 }}>
            <PillButton
              label="Vérifier maintenant"
              variant="gradient"
              loading={polling.isFetching}
              onPress={() => polling.refetch()}
            />
          </View>
          <PillButton
            label="Retour à l'accueil"
            variant="outline"
            onPress={() => router.replace("/(tabs)/home")}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (ticket.status !== "valide") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
        <View style={{ flex: 1, paddingHorizontal: 28, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons name="close" size={48} color="#DC2626" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textDark, marginBottom: 8 }}>
            Paiement non abouti
          </Text>
          <Text style={{ fontSize: 14, color: colors.textGray, textAlign: "center", marginBottom: 32 }}>
            Ce paiement n'a pas pu être confirmé. Vous pouvez réessayer l'achat.
          </Text>
          <View style={{ width: "100%", marginBottom: 12 }}>
            <PillButton
              label="Réessayer l'achat"
              variant="gradient"
              onPress={() => router.replace("/ticket/new")}
            />
          </View>
          <PillButton
            label="Retour à l'accueil"
            variant="outline"
            onPress={() => router.replace("/(tabs)/home")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={["top", "bottom"]}>
      <View style={{ flex: 1, paddingHorizontal: 28, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "#DCFCE7",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Ionicons name="checkmark" size={48} color="#16A34A" />
        </View>

        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textDark, marginBottom: 8 }}>
          Paiement réussi !
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.textGray,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Votre billet a été généré. Retrouvez-le dans l'onglet Billets avec son QR Code.
        </Text>

        <View
          style={{
            width: "100%",
            backgroundColor: colors.inputBg,
            borderRadius: 18,
            padding: 20,
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <View style={{ backgroundColor: colors.white, padding: 12, borderRadius: 16 }}>
            <QRCode
              value={ticket.qrToken}
              size={140}
              logo={require("../../../assets/logo.png")}
              logoSize={34}
              logoBorderRadius={17}
              logoBackgroundColor={colors.white}
            />
          </View>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginTop: 16 }}>
            {ticket.departure} ↔ {ticket.destination}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textGray, marginTop: 4 }}>
            {ticket.dateLabel} • {ticket.passengersLabel}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary, marginTop: 8 }}>
            {formatFcfa(ticket.total)}
          </Text>
        </View>

        <View style={{ width: "100%", marginBottom: 12 }}>
          <PillButton
            label="Voir mes billets"
            variant="gradient"
            onPress={() => router.replace("/(tabs)/tickets")}
          />
        </View>
        <PillButton
          label="Retour à l'accueil"
          variant="outline"
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>
    </SafeAreaView>
  );
}
