import { type IMemoryDb, type IBackup } from 'pg-mem';
import { type Repository, getConnection, getRepository } from 'typeorm';

import { createFakeDatabase } from '../mocks';

import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repositories';

describe('PgUserAccountRepository', (): void => {
	describe('load', (): void => {
		const email = 'email@example.com';

		let sut: PgUserAccountRepository;
		let pgUserRepository: Repository<PgUser>;

		let backup: IBackup;

		beforeAll(async (): Promise<void> => {
			const db: IMemoryDb = await createFakeDatabase([PgUser]);

			backup = db.backup();

			pgUserRepository = getRepository(PgUser);
		});

		afterAll(async (): Promise<void> => {
			await getConnection().close();
		});

		beforeEach((): void => {
			backup.restore();

			sut = new PgUserAccountRepository();
		});

		it('should return an account if email exists', async (): Promise<void> => {
			await pgUserRepository.save({ email });

			const account = await sut.load({ email });

			expect(account).toEqual({
				id: '1',
			});
		});

		it('should return undefined if email does not exists', async (): Promise<void> => {
			const account = await sut.load({ email });

			expect(account).toBeUndefined();
		});
	});
});
