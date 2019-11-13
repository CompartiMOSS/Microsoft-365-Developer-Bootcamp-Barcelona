import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import { SPPermission } from "@microsoft/sp-page-context";
import pnp, { List, ItemUpdateResult, Item } from '@pnp/pnpjs';



import * as strings from 'BSliderFieldFieldCustomizerStrings';
import BSliderField, { IBSliderFieldProps } from './components/BSliderField';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBSliderFieldFieldCustomizerProperties {
  // This is an example; replace with your own property
  value?: string;
}

const LOG_SOURCE: string = 'BSliderFieldFieldCustomizer';

export default class BSliderFieldFieldCustomizer
  extends BaseFieldCustomizer<IBSliderFieldFieldCustomizerProperties> {
    private _timerId: number = -1;
  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated BSliderFieldFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "BSliderFieldFieldCustomizer" and "${strings.Title}"`);
    return Promise.resolve();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.
    const value: string = event.fieldValue;
    const id: string = event.listItem.getValueByName('ID').toString();
    const hasPermissions: boolean = this.context.pageContext.list.permissions.hasPermission(SPPermission.editListItems);


    const slider: React.ReactElement<{}> =
      React.createElement(BSliderField, { value: value, id: id, disabled: !hasPermissions, onChange: this.onSliderValueChanged.bind(this) } as IBSliderFieldProps);

    ReactDOM.render(slider, event.domElement);
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }

  private onSliderValueChanged(value: number, id: string): void {
    if (this._timerId !== -1)
      clearTimeout(this._timerId);

    this._timerId = setTimeout(() => {
      let updateObj: any = {};
      updateObj[this.context.field.internalName] = value;
      pnp.sp.web.lists.getByTitle(this.context.pageContext.list.title).items.getById(parseInt(id))
        .update(updateObj)
        .then((result: ItemUpdateResult): void => {
          console.log(`Item with ID: ${id} successfully updated`);
        }, (error: any): void => {
          console.log('Loading latest item failed with error: ' + error);
        });
    }, 1000);
  }
}
