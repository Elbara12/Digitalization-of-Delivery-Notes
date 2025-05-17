const { Project } = require('../../business/project/domain/project');
const { InvalidCredentialsError } = require('../../business/error');

describe('Project class', () => {
  const validProject = {
    name: 'Test Project',
    email: 'test@example.com',
    address: { city: 'City', street: 'Street', number: 1 },
    userId: 1,
    clientId: 2,
  };

  it('should create a project instance with valid data', () => {
    const project = new Project(validProject);
    expect(project.name).toBe(validProject.name);
    expect(project.email).toBe(validProject.email);
    expect(project.address).toEqual(validProject.address);
    expect(project.userId).toBe(validProject.userId);
    expect(project.clientId).toBe(validProject.clientId);
  });

  it('should throw error if name is invalid', () => {
    expect(() => new Project({ ...validProject, name: '' })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, name: null })).toThrow(InvalidCredentialsError);
  });

  it('should throw error if email is invalid', () => {
    expect(() => new Project({ ...validProject, email: '' })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, email: 'invalid-email' })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, email: null })).toThrow(InvalidCredentialsError);
  });

  it('should throw error if address is invalid', () => {
    expect(() => new Project({ ...validProject, address: null })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, address: 'not-an-object' })).toThrow(InvalidCredentialsError);
  });

  it('should throw error if userId is invalid', () => {
    expect(() => new Project({ ...validProject, userId: 0 })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, userId: null })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, userId: 'abc' })).toThrow(InvalidCredentialsError);
  });

  it('should throw error if clientId is invalid', () => {
    expect(() => new Project({ ...validProject, clientId: 0 })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, clientId: null })).toThrow(InvalidCredentialsError);
    expect(() => new Project({ ...validProject, clientId: 'abc' })).toThrow(InvalidCredentialsError);
  });
  
  it('should set values using setters', () => {
    const project = new Project(validProject);

    project.id = 10;
    project.name = 'New Name';
    project.email = 'new@email.com';
    project.address = { city: 'New City', street: 'New Street', number: 99 };
    project.userId = 42;
    project.clientId = 99;
    project.archived = true;

    expect(project.id).toBe(10);
    expect(project.name).toBe('New Name');
    expect(project.email).toBe('new@email.com');
    expect(project.address).toEqual({ city: 'New City', street: 'New Street', number: 99 });
    expect(project.userId).toBe(42);
    expect(project.clientId).toBe(99);
    expect(project.archived).toBe(true);
  });
});