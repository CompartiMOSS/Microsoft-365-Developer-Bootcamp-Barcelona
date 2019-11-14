import {
  AadHttpClientFactory,
  AadHttpClient,
  HttpClientResponse
} from "@microsoft/sp-http";

import { IHeroe } from "../model";

const API_RESOURCE_URI: string = "https://marvel-api.azurewebsites.net";

export class HeroeService {

  constructor(private _endpoint: string, private _aadHttpClientFactory: AadHttpClientFactory) {

  }

  public async getHeroes(): Promise<IHeroe[]> {
    const aadHttpClient: AadHttpClient = await this._aadHttpClientFactory.getClient(API_RESOURCE_URI);
    const httpClientResponse: HttpClientResponse = await aadHttpClient.get(this._endpoint, AadHttpClient.configurations.v1);

    if (httpClientResponse.status !== 200) {
      throw new Error(`Unable to get data from API. Ensure the API is secured by Azure AD, and the endpoint configured is correct (${this._endpoint})`);
    }

    return await httpClientResponse.json();
  }
}
