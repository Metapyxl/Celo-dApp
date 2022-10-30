import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";
import { Text, View, TouchableOpacity } from "../components/Themed";
import Colors from "../constants/Colors";
import React from "react";
import PageBackground from "../shared/PageBackground";
import { OrangeButton } from "./UploadPhoto";

export default function WalletConnectionScreen({
}: RootStackScreenProps<"Root">) {
	const connector = useWalletConnect();
	return (
		<PageBackground>
			<OrangeButton
				onPress={() => connector.connect()}
				extraStyles={{ marginTop: 30, width: "80%" }}
			>
				<Text style={{ fontSize: "24px", fontWeight: "bold" }}>Connect Wallet</Text>
			</OrangeButton>
		</PageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
