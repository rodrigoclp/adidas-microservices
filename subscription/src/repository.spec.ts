import { mockedBody, mockedFilter } from './_mock/data';
import repository from './repository';

describe('Repository for MongoDB', () => {
  let model;

  beforeEach(() => {
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      exists: jest.fn(),
    };
  });

  it('Should call the model.find', async () => {
    await repository(model).read();
    expect(model.find).toBeCalled();
    expect(model.findOne).not.toBeCalled();
  });

  it('Should call the model.findOneAndUpdate with the correct parameters', async () => {
    await repository(model).upsert(mockedFilter, mockedBody);
    expect(model.findOneAndUpdate).toBeCalled();
    expect(model.findOneAndUpdate.mock.calls[0][2]).toStrictEqual({ upsert: true, overwrite: true, returnOriginal: false });
  });

  it('Should call the model.deleteOne ', async () => {
    await repository(model).destroy(mockedFilter);
    expect(model.deleteOne).toBeCalled();
  });

  it('Should call the model.exists ', async () => {
    await repository(model).exists(mockedFilter);
    expect(model.exists).toBeCalled();
  });
}); 
