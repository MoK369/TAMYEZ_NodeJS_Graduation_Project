abstract class S3FoldersPaths {
  static userFolderPath = (userId: string): string => {
    return `users/${userId}`;
  };

  static profileFolderPath = (userId: string): string => {
    return `${this.userFolderPath(userId)}/profile`;
  };
}

export default S3FoldersPaths;
