import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { LogBox } from "react-native";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { ThemeProvider } from "./context/ThemeProvider";
import React from "react";
import { Amplify } from 'aws-amplify';
import {
	withAuthenticator
} from 'aws-amplify-react-native';
import { awsconfig, signUpConfig } from "./Auth";
import AppStateContainer from "./StateContainer";

Amplify.configure(awsconfig);

function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	useEffect(() => {
		LogBox.ignoreAllLogs();
	}, []);

	if (!isLoadingComplete) {
		return null;
	} else {
		return (
			<ThemeProvider>
				<SafeAreaProvider>
					<AppStateContainer>
						<Navigation colorScheme={colorScheme} />
						<StatusBar />
					</AppStateContainer>
				</SafeAreaProvider>
			</ThemeProvider>
		);
	}
}

export default withAuthenticator(
	App,
	{
		includeGreetings: false,
		signUpConfig,
	},
);