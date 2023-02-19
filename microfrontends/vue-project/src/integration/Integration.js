import axios from "axios";

function getDefaultOptions() {
    const token = getKeycloakToken()
    if (!token) return {}
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}


export function addAuthorizationRequestConfig(config = {}) {
    let defaultOptions = getDefaultOptions();

    return {
        ...config,
        ...defaultOptions
    }
}

export function addAuthorizationRequestConfigWithBlob(config = {}) {
    let defaultOptions = getDefaultOptions();

    return {
        ...config,
        ...defaultOptions,
        responseType: 'blob'
    }
}

function getKeycloakToken() {
    if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated) {
        return window.entando.keycloak.token
    }

    return ''
}


export function getAPIUrl(config, serviceName) {
    const { systemParams } = JSON.parse(config);
    return systemParams.api[serviceName].url
}


export async function getData(config) {
    const responseObj = {}
   
    try {
        responseObj["res"] = await axios.get(`${getAPIUrl(config, 'simple-node-api')}/api/hello`, addAuthorizationRequestConfig())
    } catch (error) {
        responseObj["error"] = error.response.data
    }

    return responseObj
}

export async function getInfo(config) {
    const responseObj = {}
   
    try {
        responseObj["res"] = await axios.get(`${getAPIUrl(config, 'simple-node-api')}/api/station/info`, addAuthorizationRequestConfig())
    } catch (error) {
        responseObj["error"] = error.response.data
    }

    return responseObj
}




