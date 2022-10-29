import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";
import { Text, View, TouchableOpacity } from "../components/Themed";
import Colors from "../constants/Colors";
import React from "react";
import PageBackground from "../shared/PageBackground";

export default function WalletConnectionScreen({
	navigation,
}: RootStackScreenProps<"Root">) {
	const connector = useWalletConnect();
	return (
		<PageBackground>
			<TouchableOpacity onPress={() => connector.connect()}>
				<Text style={{ fontSize: 16 }}>Connect Wallet</Text>
			</TouchableOpacity>
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
