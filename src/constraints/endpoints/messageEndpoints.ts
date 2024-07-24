export const API_GATEWAY_BASE_URL = 'http://localhost:4000/message';

export const messageEndpoints ={
    getConvoData: `${API_GATEWAY_BASE_URL}/getconvodata`,
    createChatId: `${API_GATEWAY_BASE_URL}/createChatId`,
    getMessage: `${API_GATEWAY_BASE_URL}/getmessages`,
    sendImages: `${API_GATEWAY_BASE_URL}/sendimage`
}