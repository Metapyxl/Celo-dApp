import React, { useCallback, useEffect, useMemo } from 'react'
import { Linking, Modal, SafeAreaView, VirtualizedList, View, Text, Image, StyleSheet, StatusBar, ActivityIndicator } from "react-native"
import { Auth } from 'aws-amplify';
import { listPhotosUrlEndpoint, securedCognitoFetch, signedDownloadUrlEndpoint } from '../server';
import { isEmpty } from 'lodash';
import PageBackground from '../shared/PageBackground';
import { useState } from 'react';
import { formTitle, ModalContainer } from './UploadPhoto';
import { TouchableOpacity } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';

const photoSize = 120

const getSignedThumbnailurl = async (photo_hash, setRefetchedUrl) => {
    const headers = [["phototype", "thumbnail"], ["photoformat", 'jpg'], ["photohash", photo_hash]] as unknown as [string, string][]
    const signedDownloadUrlEndpointResponse = await securedCognitoFetch(signedDownloadUrlEndpoint, headers);
    const signedDownloadUrlEndpointForPhotoBody = await signedDownloadUrlEndpointResponse.json();
    const { s3DownloadUrl } = signedDownloadUrlEndpointForPhotoBody
    setRefetchedUrl(s3DownloadUrl)
}

const PhotoEach = ({ onClose, thumbnail_url, photo_hash }) => {
    // link to contract address
    // metadata
    // download photo to phone 

    const openAddress = useCallback(() => {
        const url = `https://explorer.celo.org/mainnet/address/${photo_hash}/transactions`
        Linking.openURL(url)
    }, [])

    return (
        <View style={{ position: "relative", padding: 20, paddingTop: 50, }}>
            <View
                style={{ ...styles.transparentOpacity, position: "absolute", right: -15 }}
            >
                <TouchableOpacity
                    style={styles.transparentOpacity}
                    onPress={onClose}
                >
                    <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text></Text>
            <Text style={{ ...formTitle, marginTop: 0, marginBottom: 10 }}>My Sick Photo</Text>
            <Image
                {...{
                    source: {
                        uri: thumbnail_url
                    },
                    style: { width: photoSize + 100, height: photoSize + 100 },
                }}
            />
            <TouchableOpacity
                style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    alignItems: "center",
                    padding: 0,
                    margin: 0,
                    marginLeft: -20
                }}
                onPress={openAddress}
            >
                <MaterialIcons name="link" size={50} color="black" />
                <Text style={{ fontSize: 20 }}>View Smart Contract</Text>
                <Text style={{ fontSize: 20 }}>{` ${photo_hash.slice(0, 5)}...`}</Text>
            </TouchableOpacity>

        </View>
    )
}


const ThumbNailPhoto = (props) => {
    const { thumbnail_url, photo_hash, status, photo_format } = props
    const [isFetchingNewThumbnailUrl] = useState(false);

    const [refetchedUrl, setRefetchedUrl] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const refetchThumbnailUrl = useCallback(async () => {
        if (isEmpty(refetchedUrl)) {
            getSignedThumbnailurl(photo_hash, setRefetchedUrl)
        }
    }, [securedCognitoFetch, refetchedUrl])

    const whichThumbnailUrl = useMemo(() => {
        return !isEmpty(refetchedUrl) ? refetchedUrl : thumbnail_url
    }, [refetchedUrl])

    return (
        < View key={photo_hash} style={
            {
                // borderWidth: .25,
                // margin: 3,
            }
        }>
            {status === "PHOTO_UPLOADING" || (isFetchingNewThumbnailUrl && isEmpty(refetchedUrl)) ? (
                <View style={{ width: photoSize, height: photoSize, display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalOpen}
                        onRequestClose={() => {
                        }}
                    >
                        <ModalContainer>
                            <PhotoEach {...{
                                thumbnail_url,
                                photo_hash,
                                onClose: () => setIsModalOpen(false)
                            }
                            } />

                        </ModalContainer>
                    </Modal>
                    <View
                        style={styles.transparentOpacity}
                    >
                        <TouchableOpacity
                            style={styles.transparentOpacity}
                            onPress={() => setIsModalOpen(true)}
                        >
                            <Image
                                {...{
                                    source: {
                                        uri: whichThumbnailUrl
                                    },
                                    style: { width: photoSize, height: photoSize },
                                    onError: () => refetchThumbnailUrl(),
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    )
}


const PhotoList = ({ navigation }) => {
    const state = navigation.getState()
    const curRoute = state.history[state.history.length - 1]?.key;
    const thisRoute = state.routes[1]?.key
    const isFocused = curRoute == thisRoute

    const [photoIds, setPhotoIds] = React.useState(null)
    const [error, setError] = React.useState(null)
    useEffect(() => {
        if (isFocused) {
            Auth.currentAuthenticatedUser().then(({ username }) => {
                const headers = [["userid", username]] as unknown as [string, string][]
                securedCognitoFetch(listPhotosUrlEndpoint, headers).then(response => {
                    response.json().then((data) => {
                        const photoObjects = data["photo_ids"].sort(function (a, b) {
                            return new Date(b["created_at"]) - new Date(a["created_at"]);
                        })
                        setPhotoIds(photoObjects)
                    })
                }).catch(err => {
                    console.log(err)
                    setError(err.message)
                })
            })
        } else {
            setPhotoIds(null)
        }
    }, [isFocused])

    const groupedPhotoIds = React.useMemo(() => {
        if (Array.isArray(photoIds)) {
            const returnVal = []
            for (let i = 0; i < photoIds.length; i += 3) {
                const thisSlice = photoIds.slice(i, i + 3)
                returnVal.push({ id: i, slice: thisSlice })
            }
            return returnVal;
        }
        return null
    }, [photoIds]);

    return (
        <PageBackground>
            {Array.isArray(photoIds) ? (
                <SafeAreaView style={styles.container}>
                    <VirtualizedList
                        data={groupedPhotoIds}
                        renderItem={({ item }, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{ display: "flex", flexDirection: "row", width: "100%" }}
                                >
                                    {item.slice.map(photoObj => {
                                        return (
                                            <ThumbNailPhoto {...{ ...photoObj }} />
                                        )
                                    })}
                                </View>
                            )
                        }}
                        keyExtractor={item => item?.id}
                        getItemCount={data => Array.isArray(data) ? data.length : 0}
                        getItem={(a, b) => {
                            return a[b]
                        }}
                    />
                </SafeAreaView>
            ) : (
                <View style={{ height: 200, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} />
                </View>
            )}
        </PageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        marginTop: StatusBar.currentHeight + 5,
    },
    transparentOpacity: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: photoSize,
        width: photoSize,
        padding: 0,
        margin: 0,
        backgroundColor: "transparent"
    }
    // item: {
    //     backgroundColor: '#f9c2ff',
    //     height: 150,
    //     justifyContent: 'center',
    //     marginVertical: 8,
    //     marginHorizontal: 16,
    //     padding: 20,
    // },
});

export default PhotoList