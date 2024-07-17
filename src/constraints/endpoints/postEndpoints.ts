export const API_GATEWAY_BASE_URL = 'http://localhost:4000/post';

export const postEndpoints ={
    addPost: `${API_GATEWAY_BASE_URL}/addPost`,
    getPosts:`${API_GATEWAY_BASE_URL}/getPosts`,
    userPosts:`${API_GATEWAY_BASE_URL}/userPosts`,
    likePost:`${API_GATEWAY_BASE_URL}/likePost`,
    unlikePost: `${API_GATEWAY_BASE_URL}/unlikePost`,
    fetchComment: `${API_GATEWAY_BASE_URL}/viewComments`
}