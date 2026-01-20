class S3FoldersPaths {
    static userFolderPath = (userId) => {
        return `users/${userId}`;
    };
    static profileFolderPath = (userId) => {
        return `${this.userFolderPath(userId)}/profile`;
    };
    static careerFolderPath = (assetFolderId) => {
        return `careers/${assetFolderId}`;
    };
    static careerResourceFolderPath = (assetFolderId, resourceName) => {
        return `careers/${assetFolderId}/${resourceName}`;
    };
}
export default S3FoldersPaths;
