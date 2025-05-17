const { NoteController } = require('../../infrastructure/web/controller/noteCotroller');
const InsertNote = require('../../business/deliveryNote/useCases/insertNote');
const GetNotes = require('../../business/deliveryNote/useCases/getNotes');
const GetNoteById = require('../../business/deliveryNote/useCases/getNoteById');
const GeneratePDF = require('../../business/deliveryNote/useCases/generatePDF');
const UrlUpload = require('../../business/deliveryNote/useCases/urlUpload');
const DeleteNote = require('../../business/deliveryNote/useCases/deleteNote');

describe('NoteController', () => {
  let controller;
  let mockDAO;

  beforeEach(() => {
    mockDAO = {};
    controller = new NoteController(mockDAO);
  });

  it('should create a new note', async () => {
    InsertNote.prototype.execute = jest.fn().mockResolvedValue('created');
    const result = await controller.create({ user: {}, body: {} });
    expect(result.statusCode).toBe(201);
    expect(result.payload).toBe('created');
  });

  it('should fail to create a note', async () => {
    InsertNote.prototype.execute = jest.fn().mockRejectedValue(new Error('failed'));
    const result = await controller.create({ user: {}, body: {} });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('failed');
  });

  it('should get all notes', async () => {
    GetNotes.prototype.execute = jest.fn().mockResolvedValue('notes');
    const result = await controller.getAll({ user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('notes');
  });

  it('should handle error in getAll', async () => {
    GetNotes.prototype.execute = jest.fn().mockRejectedValue(new Error('get all failed'));
    const result = await controller.getAll({ user: { id: 1 } });
    expect(result.statusCode).toBe(500);
    expect(result.payload.error).toBe('get all failed');
  });

  it('should get a note by id', async () => {
    GetNoteById.prototype.execute = jest.fn().mockResolvedValue('note');
    const result = await controller.getNoteById({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload).toBe('note');
  });

  it('should fail to get a note by id', async () => {
    GetNoteById.prototype.execute = jest.fn().mockRejectedValue(new Error('not found'));
    const result = await controller.getNoteById({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(500);
    expect(result.payload.error).toBe('not found');
  });

  it('should generate and return PDF URL', async () => {
    GeneratePDF.prototype.execute = jest.fn().mockResolvedValue({ url: 'https://ipfs.io/myfile.pdf' });
    const result = await controller.downloadPdf({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload.url).toBe('https://ipfs.io/myfile.pdf');
  });

  it('should fail to generate PDF', async () => {
    GeneratePDF.prototype.execute = jest.fn().mockRejectedValue(new Error('pdf failed'));
    const result = await controller.downloadPdf({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('pdf failed');
  });

  it('should upload signature', async () => {
    UrlUpload.prototype.execute = jest.fn().mockResolvedValue({ message: 'uploaded' });
    const result = await controller.urlUpload({
      params: { noteId: ':1' },
      user: { id: 1 },
      file: { path: '/path/to/file.png' },
    });
    expect(result.statusCode).toBe(200);
    expect(result.payload.message).toBe('uploaded');
  });

  it('should fail to upload signature', async () => {
    UrlUpload.prototype.execute = jest.fn().mockRejectedValue(new Error('upload failed'));
    const result = await controller.urlUpload({
      params: { noteId: ':1' },
      user: { id: 1 },
      file: { path: '/path/to/file.png' },
    });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('upload failed');
  });

  it('should delete a note', async () => {
    DeleteNote.prototype.execute = jest.fn().mockResolvedValue({ message: 'deleted' });
    const result = await controller.delete({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(200);
    expect(result.payload.message).toBe('deleted');
  });

  it('should fail to delete a note', async () => {
    DeleteNote.prototype.execute = jest.fn().mockRejectedValue(new Error('delete error'));
    const result = await controller.delete({ params: { noteId: ':1' }, user: { id: 1 } });
    expect(result.statusCode).toBe(400);
    expect(result.payload.error).toBe('delete error');
  });
});