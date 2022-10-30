import { useState, useEffect } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Text, TouchableOpacity } from "../components/Themed";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import PageBackground from "../shared/PageBackground";
import { Auth } from "aws-amplify";
import { useCallback } from "react";
import { Image, View } from "react-native";
import { OrangeButton } from "./UploadPhoto";

export default function Account() {
	const connector = useWalletConnect();
	const [accountLink, setAccountLink] = useState("");
	useEffect(() => {
		setAccountLink(
			`https://explorer.celo.org/mainnet/address/${connector.accounts[0]}`
		);
	}, [connector]);

	function navToAcct() {
		WebBrowser.openBrowserAsync(accountLink);
	}

	const awsSignOut = useCallback(async () => {
		try {
			await Auth.signOut();
		} catch (error) {
			console.log('error signing out: ', error);
		}
	}, [Auth])

	return (
		<PageBackground>

			<View style={{ width: "95 %" }}>
				<Text style={styles.whiteText}>Profile</Text>
				<View style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
					{connector.connected ? (
						<>
							<OrangeButton
								onPress={() => connector.killSession()}
								extraStyles={{ marginTop: 10, width: "80%" }}

							>
								<Text style={styles.buttonText}>Disconnect Wallet</Text>
							</OrangeButton>

							<OrangeButton
								onPress={navToAcct}
								extraStyles={{ marginTop: 10, width: "80%" }}
							>
								<Text style={styles.buttonText}>
									Navigate to Account
								</Text>
							</OrangeButton>
						</>
					) : (
						<OrangeButton
							onPress={() => connector.connect()}
							extraStyles={{ marginTop: 10, width: "80%" }}

						>
							<Text style={styles.buttonText}>Connect Wallet</Text>
						</OrangeButton>
					)}
					<OrangeButton
						onPress={() => awsSignOut()}
						extraStyles={{ marginTop: 10, width: "80%" }}
					>
						<Text style={styles.buttonText}>
							Log Out
						</Text>
					</OrangeButton>
				</View>
				{connector.connected ? (
					<>
						<Text style={{ ...styles.whiteText, marginTop: 10 }}>Connected Wallets</Text>
						<View style={{ marginLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
							<Image source={require("../shared/Velora.png")} style={{ width: 40, height: 40, marginRight: 5 }} />
							<Text style={{ fontSize: "24px" }}>Valora</Text>
						</View>
					</>
				) : <></>}
			</View>

		</PageBackground >
	);
}

const styles = {
	whiteText: {
		fontWeight: "bold",
		fontSize: "24px"
	},
	buttonText: {
		fontSize: "24px",
		fontWeight: "bold"
	}
}