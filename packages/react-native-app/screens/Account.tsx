import { useState, useEffect } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Text, TouchableOpacity } from "../components/Themed";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import PageBackground from "../shared/PageBackground";
import { Auth } from "aws-amplify";
import { useCallback } from "react";

export default function Account() {
	const connector = useWalletConnect();
	const [accountLink, setAccountLink] = useState("");
	useEffect(() => {
		setAccountLink(
			`https://explorer.celo.org/mainnet/address/${connector.accounts[0]}`
		);
	}, [connector]);

	function handlePress() {
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
		<PageBackground >

			{connector.connected ? (
				<>
					<TouchableOpacity
						onPress={handlePress}>
						<Text>
							{connector.accounts[0]}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => connector.killSession()}>
						<Text>Disconnect Wallet</Text>
					</TouchableOpacity>
				</>
			) : (<></>)}
			<TouchableOpacity onPress={() => awsSignOut()}>
				<Text>Sign out of Metapyxl account</Text>
			</TouchableOpacity>
		</PageBackground>
	);
}
