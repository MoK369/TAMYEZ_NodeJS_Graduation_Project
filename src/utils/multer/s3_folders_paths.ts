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

  static careerResourceFolderPath = (
    assetFolderId: string,
    resourceName: string,
  ): string => {
    return `careers/${assetFolderId}/${resourceName}`;
  };
}

export default S3FoldersPaths;
