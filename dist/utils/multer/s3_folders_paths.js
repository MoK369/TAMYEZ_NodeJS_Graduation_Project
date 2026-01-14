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
}
export default S3FoldersPaths;
