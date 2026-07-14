export const colors = {
  primary: "#0B5ED7",
  primaryDark: "#0B5ED7",
  primaryLight: "#4EA8DE",
  primaryTint: "#EAF3FC",
  white: "#FFFFFF",
  textDark: "#111827",
  textGray: "#6B7280",
  inputBg: "#F3F4F6",
  inputBgOnBlue: "rgba(255,255,255,0.15)",
  border: "#E5E7EB",
} as const;

export const gradients = {
  primary: [colors.primaryLight, colors.primaryDark] as const,
};
