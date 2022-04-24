import { UserFullNamePipe } from './user-full-name.pipe';

describe('UserFullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new UserFullNamePipe();
    expect(pipe).toBeTruthy();
  });
});
