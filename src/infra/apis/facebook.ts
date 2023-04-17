import { type HttpGetClient } from '@/infra/http';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';

type AppToken = {
	access_token: string;
};

type DebugToken = {
	data: {
		user_id: string;
	};
};

type UserInfo = {
	id: string;
	name: string;
	email: string;
};

export class FacebookAPI implements LoadFacebookUserApi {
	private static readonly baseURL: string = 'https://graph.facebook.com';
	private static readonly grantType: string = 'client_credentials';

	constructor(
		private readonly httpClient: HttpGetClient,
		private readonly clientId: string,
		private readonly clientSecret: string,
	) {}

	public async loadUser(
		input: LoadFacebookUserApi.Input,
	): Promise<LoadFacebookUserApi.Output> {
		const userInfo = await this.getUserInfo(input.token);

		return {
			facebookId: userInfo.id,
			name: userInfo.name,
			email: userInfo.email,
		};
	}

	private async getAppToken(): Promise<AppToken> {
		return await this.httpClient.get<AppToken>({
			url: `${FacebookAPI.baseURL}/oauth/access_token`,
			params: {
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: FacebookAPI.grantType,
			},
		});
	}

	private async getDebugToken(clientToken: string): Promise<DebugToken> {
		const appToken = await this.getAppToken();

		return await this.httpClient.get<DebugToken>({
			url: `${FacebookAPI.baseURL}/debug_token`,
			params: {
				access_token: appToken.access_token,
				input_token: clientToken,
			},
		});
	}

	private async getUserInfo(clientToken: string): Promise<UserInfo> {
		const debugToken = await this.getDebugToken(clientToken);

		return await this.httpClient.get<UserInfo>({
			url: `${FacebookAPI.baseURL}/${debugToken.data.user_id}`,
			params: {
				fields: ['id', 'name', 'email'].join(','),
				access_token: clientToken,
			},
		});
	}
}