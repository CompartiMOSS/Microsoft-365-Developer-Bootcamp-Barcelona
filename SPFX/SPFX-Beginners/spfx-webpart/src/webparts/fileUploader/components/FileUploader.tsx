import * as React from 'react'; 
import styles from './FileUploader.module.scss';
import { IFileUploaderProps } from './IFileUploaderProps';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import DropzoneComponent  from 'react-dropzone-component';
import {Web} from '@pnp/pnpjs';
export default class FileUploader extends React.Component<IFileUploaderProps, {}> {
  constructor(props: IFileUploaderProps){
    super(props);  
  }
  public render(): React.ReactElement<IFileUploaderProps> {
    let _context = this.props.context;
    let _listName = this.props.listName;
    let _fileUploadTo=this.props.uploadFilesTo;
    let _queryStringParam = this.props.queryString;
    let queryParameters = new UrlQueryParameterCollection(window.location.href);
    let _itemId = queryParameters.getValue(_queryStringParam);
    let componentConfig = {
      iconFiletypes: this.props.fileTypes.split(','),
      showFiletypeIcon: true,
      postUrl: _context.pageContext.web.absoluteUrl
    };
    let myDropzone;
    let eventHandlers = {
      // This one receives the dropzone object as the first parameter
      // and can be used to additional work with the dropzone.js
      // object
      init: function(dz){       
       myDropzone=dz;
      },
      removedfile: function(file){
        let web:Web=new Web(_context.pageContext.web.absoluteUrl);     
        if(_fileUploadTo=="DocumentLibrary"){
          web.lists.getById(_listName).rootFolder.files.getByName(file.name).delete().then(t=>{
            //add your code here if you want to do more after deleting the file
          });
        }
        else{
          web.lists.getById(_listName).items.getById(Number(_itemId)).attachmentFiles.deleteMultiple(file.name).then(t=>{            
            //add your code here if you want to do more after deleting the file
          });
        }          
      },
      processing: function (file, xhr) {
        
        if(_fileUploadTo=="DocumentLibrary")
          myDropzone.options.url = `${_context.pageContext.web.absoluteUrl}/_api/web/Lists/getById('${_listName}')/rootfolder/files/add(overwrite=true,url='${file.name}')`;          
        else
        {          
          if(_itemId)
            myDropzone.options.url = `${_context.pageContext.web.absoluteUrl}/_api/web/lists/getById('${_listName}')/items(${_itemId})/AttachmentFiles/add(FileName='${file.name}')`;
          else
            alert('Item not found or query string value is null!')
        }
      },
      sending: function (file, xhr) {
        let _send = xhr.send;
        xhr.send = function () {
          _send.call(xhr, file);
        };
      },
      error:function(file,error,xhr){
        if(_fileUploadTo!="DocumentLibrary")
          alert(`File '${file.name}' is already exists, please rename your file or select another file.`);        
      }
     };
    var djsConfig = {
      headers: {
        "X-RequestDigest": this.props.digest
      },
      addRemoveLinks:true
    };
    return (
      <DropzoneComponent eventHandlers={eventHandlers} djsConfig={djsConfig} config={componentConfig}>
        <div className="dz-message icon ion-upload">Drop files here or click to upload.</div>
      </DropzoneComponent>
    );
  }
}
