class S3FoldersPaths {
    static userFolderPath = (userId) => {
        return `users/${userId}`;
    };
    static profileFolderPath = (userId) => {
        return `${this.userFolderPath(userId)}/profile`;
    };
}
export default S3FoldersPaths;
