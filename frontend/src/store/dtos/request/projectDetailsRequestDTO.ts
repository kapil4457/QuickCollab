export interface ProjectDetailsRequestDTO {
  title: string;
  description: string;
  mediaFiles: Array<File>;
  externalLinks: Array<ExternalLink>;
  existingMedia: Array<MediaFile>;
  projectId: number;
}

export interface ExternalLink {
  url: string;
  title: string;
}

export interface MediaFile {
  url: string;
  type: string;
}
