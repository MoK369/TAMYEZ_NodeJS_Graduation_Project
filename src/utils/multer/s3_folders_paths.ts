abstract class S3FoldersPaths {
  static userFolderPath = (userId: string): string => {
    return `users/${userId}`;
  };

  static profileFolderPath = (userId: string): string => {
    return `${this.userFolderPath(userId)}/profile`;
  };

  static careerFolderPath = (assetFolderId: string): string => {
    return `careers/${assetFolderId}`;
  };
}

export default S3FoldersPaths;
