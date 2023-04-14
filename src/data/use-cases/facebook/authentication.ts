import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type CreateFacebookAccountRepository,
	type LoadUserAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly loadFacebookUserApi: LoadFacebookUserApi,
		private readonly loadUserAccountRepository: LoadUserAccountRepository,
		private readonly createFacebookAccountRepository: CreateFacebookAccountRepository,
	) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		const fbData = await this.loadFacebookUserApi.exec(input);

		if (fbData != null) {
			await this.loadUserAccountRepository.findOne({
				email: fbData.email,
			});

			await this.createFacebookAccountRepository.createFromFacebook(fbData);
		}

		return new AuthenticationError();
	}
}
