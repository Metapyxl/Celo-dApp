import { Auth } from 'aws-amplify';

export const apiBase = "https://puh8rjlwl6.execute-api.us-east-1.amazonaws.com/serverless_lambda_stage_prod"
// const apiBase = "http://localhost:8001"
// const signedUploadUrlEndpoint = apiBase + "/photo_service/get_signed_upload_url"
export const signedUploadUrlEndpoint = apiBase + "/signed_upload_url_v2"
export const listPhotosUrlEndpoint = apiBase + "/list_photos"
export const signedDownloadUrlEndpoint = apiBase + "/get_download_url"
// const listPhotosEndpoint = apiBase + "/photo_service/list_photos"

export const securedCognitoFetch = async (url: string, otherHeaders?: [string, string][]) => {
    const session = await Auth.currentSession();
    let jwt = session.getAccessToken()?.getJwtToken();

    const headers = new Headers();

    headers.append(
        "Authorization",
        `Bearer ${jwt}`
    );

    otherHeaders?.forEach(([key, val]) => {
        headers.append(key, val)

    })

    return await fetch(url, { headers })
}

export const securedCognitoPost = async (url: string, body?: BodyInit) => {
    const session = await Auth.currentSession();
    let jwt = session.getAccessToken()?.getJwtToken();

    const headers = new Headers();

    headers.append(
        "Authorization",
        `Bearer ${jwt}`
    );

    headers.append(
        "Content-Type",
        "application/json"
    );

    return await fetch(
        url,
        {
            headers,
            body,
            method: "POST"
        });
}