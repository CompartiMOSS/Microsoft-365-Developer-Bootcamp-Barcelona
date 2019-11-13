import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import HtmlDialog from './HtmlDialog';

import * as strings from 'DirectionsCommandSetStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 *
 * GMAPS API KEY
 * https://console.cloud.google.com/
 * ?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"5d5b6ea5-e481-4a42-9b18-89ba98905195":{"location":"ClientSideExtension.ListViewCommandSet.CommandBar","properties":{"startingLocation":"Carrer del Triangle, 1, 4, 08002 Barcelona","addressColumnName":"Address","title":"Driving directions","message":"Driving directions to ","mode":"driving","mapsApiKey":"GOOGLE_API_KEY"}}}
 * */
export interface IDirectionsCommandSetProperties {
  startingLocation: string;
  addressColumnName: string;
  title: string;
  message: string;
  mode: string;
  mapsApiKey: string;
}

const LOG_SOURCE: string = 'DirectionsCommandSet';

export default class DirectionsCommandSet extends BaseListViewCommandSet<IDirectionsCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized DirectionsCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    new HtmlDialog(this.properties.title, `${this.properties.message} ${event.selectedRows[0].getValueByName('Title')}`,
    `<iframe width="600" height="450" frameborder="0" style="border:0"
src="https://www.google.com/maps/embed/v1/directions?origin=${encodeURIComponent(this.properties.startingLocation)}&destination=${encodeURIComponent(event.selectedRows[0].getValueByName(this.properties.addressColumnName))}&mode=${this.properties.mode}&key=${this.properties.mapsApiKey}" allowfullscreen></iframe>`, 'Close').show();
  }
}
