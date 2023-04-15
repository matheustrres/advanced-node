import axios, { type AxiosStatic } from 'axios';

import { type HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
	public async get({ params, url }: HttpGetClient.Input): Promise<void> {
		await axios.get(url, {
			params,
		});
	}
}

describe('AxiosHttpClient', (): void => {
	let sut: AxiosHttpClient;
	let mockedAxios: jest.Mocked<AxiosStatic>;

	let url: string;
	let params: object;

	beforeAll((): void => {
		mockedAxios = axios as jest.Mocked<typeof axios>;

		url = 'any_url';
		params = {
			any: 'any',
		};
	});

	beforeEach((): void => {
		sut = new AxiosHttpClient();
	});

	describe('X GET', (): void => {
		it('should call get with correct input', async (): Promise<void> => {
			await sut.get({ url, params });

			expect(mockedAxios.get).toHaveBeenCalledWith(url, {
				params,
			});
			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		});
	});

	// describe('X POST', (): void => {
	//   it('should', (): void => {

	//   });
	// });
});
