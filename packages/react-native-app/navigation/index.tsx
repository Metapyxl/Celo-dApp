import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import Account from "../screens/Account";
import UploadPhoto from "../screens/UploadPhoto";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PhotoList from "../screens/PhotoList";
import { ImageBackground } from 'react-native'
import Background from '../shared/Background.png';

export default function Navigation({
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Root'
				component={Tabs}
				options={{ headerShown: false }}
			/>

			<Stack.Screen
				name='NotFound'
				component={NotFoundScreen}
				options={{ title: "Oops!" }}
			/>
		</Stack.Navigator>
	);
}

const Tab = createMaterialTopTabNavigator();

function Tabs() {
	return (
		<SafeAreaProvider>
			<ImageBackground
				source={Background}
				resizeMode="cover"
				style={{
					width: "100%",
					height: "100%",
				}}
			>
				<Tab.Navigator
					initialRouteName='Greeter'
					screenOptions={{
						tabBarShowIcon: true,
						tabBarShowLabel: false,
						tabBarStyle: {
							paddingTop: 30,
							backgroundColor: "rgba(0,0,0,0)"
						},
					}}>
					<Tab.Screen
						name='A'
						options={() => ({
							tabBarShowIcon: true,
							tabBarIcon: ({ focused }) => {
								return <MaterialIcons name="file-upload" size={25} color={focused ? "black" : "white"} />
							},
						})}
						children={(props) => {
							const { navigation } = props
							return (
								<UploadPhoto {...{ navigation }} />
							)
						}
						}
					/>
					<Tab.Screen
						name='B'
						options={() => ({
							tabBarShowIcon: true,
							tabBarIcon: ({ focused }) => {
								return <MaterialIcons name="my-library-books" size={25} color={focused ? "black" : "white"} />
							},
						})}
						children={({ navigation }) => (<PhotoList {...{ navigation }} />
						)}
					/>
					<Tab.Screen
						name='C'
						options={() => ({
							tabBarShowIcon: true,
							tabBarIcon: ({ focused }) => {
								return <MaterialIcons name="person-outline" size={25} color={focused ? "black" : "white"} />
							},
						})}
						children={(props) => (
							<Account />
						)}
					/>
				</Tab.Navigator>
			</ImageBackground>

		</SafeAreaProvider>
	);
}
