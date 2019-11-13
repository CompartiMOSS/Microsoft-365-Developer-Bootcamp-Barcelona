import {
  IWebPartContext
} from '@microsoft/sp-webpart-base';
export interface IFileUploaderProps {
  digest:string;
  context:IWebPartContext;
  listName:string;
  fileTypes:string;
  queryString:string;
  uploadFilesTo:string;
}
