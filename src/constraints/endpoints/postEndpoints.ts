export const API_GATEWAY_BASE_URL = 'https://hirehubbackend.online/post';
// export const API_GATEWAY_BASE_URL = 'http://localhost:4000/post';

export const postEndpoints ={
    addPost: `${API_GATEWAY_BASE_URL}/addPost`,
    getPosts:`${API_GATEWAY_BASE_URL}/getPosts`,
    userPosts:`${API_GATEWAY_BASE_URL}/userPosts`,
    likePost:`${API_GATEWAY_BASE_URL}/likePost`,
    unlikePost: `${API_GATEWAY_BASE_URL}/unlikePost`,
    addComment: `${API_GATEWAY_BASE_URL}/addComment`,
    fetchComment: `${API_GATEWAY_BASE_URL}/viewComments`,
    deleteComment: `${API_GATEWAY_BASE_URL}/deleteComment`,
    deletePost: `${API_GATEWAY_BASE_URL}/deletePost`,
    reportPost: `${API_GATEWAY_BASE_URL}/reportPost`,
    updatePost:`${API_GATEWAY_BASE_URL}/updatePost`,
    editComment:`${API_GATEWAY_BASE_URL}/editComment`,
    notification: `${API_GATEWAY_BASE_URL}/getNotification`

}