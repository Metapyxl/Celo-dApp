
import React, { useEffect } from 'react';
import { View, Image, Button, Platform, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Auth } from 'aws-amplify';
import { securedCognitoFetch, securedCognitoPost, signedUploadUrlEndpoint } from '../server';
import { MaterialIcons } from '@expo/vector-icons';
import { isEmpty, isNull } from 'lodash';
import uuid from 'react-native-uuid';
import PageBackground from '../shared/PageBackground';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectionScreen from './WalletConnectionScreen';
import createContract from './createContract/createContract';
// import MetapxylLogo from '../shared/MetapxylLogo';

const photoBoxSize = 350
const buttonSize = 18

const today = new Date(Date.now()).toISOString().split("T")[0];

const OrangeButton = ({ children, onPress }) => {
    return (
        <View style={{
            borderRadius: 20,
            backgroundColor: "#FBB600",

        }}>
            <TouchableOpacity {...{
                onPress, style: {
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }
            }}>
                {children}
            </TouchableOpacity>
        </View>
    )
}

const BottomSelectButtons = ({ openModal, choosePhoto }) => {

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                marginTop: "20%"
            }}
        >
            <OrangeButton {...{
                onPress: openModal
            }}>
                <MaterialIcons name="enhanced-encryption" size={buttonSize} color={"white"} />
                <Text style={{ fontSize: buttonSize, color: "white" }}>Metamark</Text>
            </OrangeButton>
            <OrangeButton {...{
                onPress: choosePhoto
            }}>
                <MaterialIcons name="photo" size={buttonSize} color={"white"} />
                <Text style={{ fontSize: buttonSize, color: "white" }}>Select Photo</Text>
            </OrangeButton>
        </View>

    )
}

const SelectPhotoBox = ({ onPress }) => {

    return (
        <TouchableOpacity {...{ onPress }}>

            <View
                style={{
                    backgroundColor: "white",
                    height: photoBoxSize,
                    width: photoBoxSize,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ ...styles.uploadText }}>Select Photo to Metamark</Text>
            </View>
        </TouchableOpacity>

    )
}

export const ModalContainer = ({ children }) => {
    return (
        <View style={{ height: "100%", width: "100%", justifyContent: "flex-end", alignItems: "center" }}>
            <View style={{ backgroundColor: "white", height: "70%", width: photoBoxSize }}>
                {children}
            </View>
        </View>
    )
}


const CONTRACT_DEPLOYING_STAGE = "CONTRACT_DEPLOYING_STAGE"
const UPLOADING_STAGE = "UPLOADING_STAGE"
const UPLOADED_STAGE = "UPLOADED_STAGE"

const UploadPhoto = ({ navigation }) => {
    const walletConnection = useWalletConnect();

    const [selectedPhoto, setSelectedPhoto] = React.useState(null);
    const [stage, setStage] = React.useState(CONTRACT_DEPLOYING_STAGE);
    const [error, setError] = React.useState(null);
    const [alert, setAlert] = React.useState(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = React.useState(null)
    const [isUploadingModalOpen, setIsUploadingModalOpen] = React.useState(false)
    const [photoHash, setPhotoHash] = React.useState(uuid.v4())

    const openModal = () => setIsVerifyModalOpen(true)

    const resetState = () => {
        setSelectedPhoto(null)
        setStage(null)
        setError(null)
        setAlert(null)
        setIsVerifyModalOpen(false)
        setIsUploadingModalOpen(false)
    }

    const choosePhoto = async () => {

        let photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!isEmpty(photo)) {
            setSelectedPhoto(photo as any)
        }
    }

    const handleUploadPhoto = async () => {
        setError(null)
        try {
            setIsVerifyModalOpen(false)
            setIsUploadingModalOpen(true)
            const { username } = await Auth.currentAuthenticatedUser();

            const photoLocation = selectedPhoto.uri as unknown as string;

            let format

            let splitLocation = photoLocation.split(".")

            if (splitLocation.length > 1) {
                format = splitLocation[splitLocation.length - 1]
            }

            setStage(CONTRACT_DEPLOYING_STAGE)

            const celoPhotoHash = await createContract(walletConnection)

            setPhotoHash(celoPhotoHash)

            const otherHeaders = [["userid", username], ["photoformat", format], ["photohash", celoPhotoHash]] as unknown as [string, string][]

            setStage(UPLOADING_STAGE)

            const signedUploadUrlEndpointResponse = await securedCognitoFetch(signedUploadUrlEndpoint, otherHeaders);

            const signedUploadUrlEndpointForPhotoBody = await signedUploadUrlEndpointResponse.json();

            const { s3UploadUrl } = signedUploadUrlEndpointForPhotoBody;

            const response = await fetch(photoLocation);
            const blob = await response.blob();

            await fetch(s3UploadUrl, {
                method: "PUT",
                body: blob,
            });

            setStage(UPLOADED_STAGE)

            setTimeout(() => {
                navigation.navigate("B")
                resetState()
            }, 3000)

        } catch (error) {
            console.log('upload error', error)
            resetState()
            setError(error?.message)
        }
    };

    return (
        <PageBackground>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVerifyModalOpen}
                onRequestClose={() => {
                }}
            >
                <ModalContainer>
                    <View style={{ margin: 20 }}>
                        <Text style={styles.formTitle}>Metadata</Text>
                        <BlackLine />
                        <Text style={styles.formInput}>{`Image Author:   Jonathan Cannon`}</Text>
                        <BlackLine />
                        <Text style={styles.formInput}>{`Photo Name:   My Sick Photo`}</Text>
                        <BlackLine />
                        <Text style={styles.formInput}>{`Date Created:   ${today}`}</Text>
                        <BlackLine />


                        <Text style={styles.formTitle}>Customize License</Text>
                        <BlackLine />
                        <View style={{ ...styles.contractBox, backgroundColor: "rgba(211,211,211,.4)" }}>

                            <MaterialIcons name="assignment" size={24} color="black" />
                            <Text style={styles.formInput}>ERC-721</Text>
                        </View>
                        <View style={styles.contractBox}>

                            <MaterialIcons name="assignment" size={24} color="black" />
                            <Text style={styles.formInput}>ERC-1155</Text>
                        </View>
                        <View style={{ height: 50 }} />
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                            <OrangeButton {...{
                                onPress: handleUploadPhoto
                            }}>
                                <MaterialIcons name="enhanced-encryption" size={buttonSize} color={"white"} />
                                <Text style={{ fontSize: buttonSize, color: "white" }}>Publish to Blockchain</Text>
                            </OrangeButton>
                            <OrangeButton {...{
                                onPress: () => setIsVerifyModalOpen(false)
                            }}>
                                <MaterialIcons name="cancel" size={buttonSize} color={"white"} />
                                <Text style={{ fontSize: buttonSize, color: "white" }}>Cancel</Text>
                            </OrangeButton>
                        </View>
                    </View>
                </ModalContainer>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isUploadingModalOpen}
                onRequestClose={() => {
                }}
            >
                <ModalContainer>
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={{ ...styles.uploadText }}>Deploying Smart Contract</Text>
                        <View style={{ ...styles.uploadBox, backgroundColor: stage !== CONTRACT_DEPLOYING_STAGE ? "#FBB600" : "white" }}>
                            {stage === CONTRACT_DEPLOYING_STAGE && <ActivityIndicator size="large" color="#FBB600" />}
                        </View>
                        <View style={{ height: 30 }}>
                            {stage !== CONTRACT_DEPLOYING_STAGE && (
                                <>
                                    <Text style={{ fontSize: 12 }}>Contract Address:</Text>
                                    <Text style={{ fontSize: 12 }}>{photoHash}</Text>
                                </>
                            )}
                        </View>

                        <Text style={{ ...styles.uploadText, marginTop: 25 }}>Uploading Image</Text>
                        <View style={{ ...styles.uploadBox, backgroundColor: stage === UPLOADED_STAGE ? "#FBB600" : "white" }}>
                            {stage === UPLOADING_STAGE && <ActivityIndicator size="large" color="#FBB600" />}
                        </View>
                        {stage === UPLOADED_STAGE && <Text style={{ color: "#00A3FF", fontWeight: "bold", fontSize: "18px", marginTop: 25 }}>Encrypting image...</Text>}
                    </View>
                </ModalContainer>
            </Modal>
            <View style={{ margin: 15 }}>
                {/* <MetapxylLogo /> */}
                {!isEmpty(selectedPhoto) && !selectedPhoto?.cancelled ? (
                    <>
                        <Image
                            source={{ uri: selectedPhoto.uri }}
                            style={{ width: photoBoxSize, height: photoBoxSize }} />
                        <BottomSelectButtons {...{ openModal, choosePhoto }} />
                    </>
                ) : (
                    <></>
                    // <SelectPhotoBox onPress={choosePhoto} />
                )}

                {!isEmpty(error) ? (
                    <Text>{error} Please try again later.</Text>
                ) : (<></>)}

                {!isEmpty(alert) ? (
                    <Text>{alert} </Text>
                ) : (<></>)}
            </View>
        </PageBackground>
    );
};

const BlackLine = () => (<View style={{ borderColor: "lightgrey", borderWidth: .5, width: "100%" }} />)

export const formTitle = {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 24,
    color: "#6C6C6C",

}
const styles = {
    formTitle,
    formInput: {
        color: "#6C6C6C",
        fontSize: 20,
    },
    contractBox: {
        borderWidth: .5,
        borderColor: "#6C6C6C",
        width: 150,
        display: "flex",
        flexDirection: "row",
        padding: 5,
        margin: 5
    },
    uploadText: {
        color: "#00A3FF",
        fontWeight: "bold",
        fontSize: 24
    },
    uploadBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#00A3FF",
        width: "90%",
        height: 55,
        marginTop: 25,
    }
}


const UploadPhotoContainer = (props) => {
    const connector = useWalletConnect();

    return (
        <>
            {
                connector.connected ? (
                    <UploadPhoto {...props} />
                ) : (
                    <WalletConnectionScreen />
                )
            }
        </>
    )
}

export default UploadPhotoContainer;