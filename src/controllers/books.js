import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} from '../models/books.js';
import { getAuthorById } from '../models/authors.js';

const bookFields = ['id', 'authorId', 'title', 'publicationDate'];
const writableBookFields = ['authorId', 'title', 'publicationDate'];

const validateBook = (body, fields) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'Request body must be an object.';
    }

    const unknownField = Object.keys(body).find((field) => {
        return !fields.includes(field);
    });
    if (unknownField) {
        return `Unknown field: ${unknownField}.`;
    }

    const missingField = fields.find((field) => {
        return body[field] === undefined || body[field] === null || body[field] === '';
    });
    if (missingField) {
        return `${missingField} is required.`;
    }

    const invalidField = fields.find((field) => {
        return typeof body[field] !== 'string' || body[field].trim() !== body[field];
    });
    if (invalidField) {
        return `${invalidField} must be a non-empty string without surrounding whitespace.`;
    }

    return null;
};

const validationError = (res, message) => {
    return res.status(400).json({
        error: 'Invalid book data',
        details: message
    });
};

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('Error fetching book by ID:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createBookHandler = async (req, res) => {
    const validationMessage = validateBook(req.body, bookFields);
    if (validationMessage) {
        return validationError(res, validationMessage);
    }

    try {
        if (await getBookById(req.body.id)) {
            return res.status(400).json({ error: 'Book with this ID already exists.' });
        }
        if (!await getAuthorById(req.body.authorId)) {
            return res.status(400).json({ error: 'authorId must match an existing author.' });
        }

        const book = {
            id: req.body.id,
            authorId: req.body.authorId,
            title: req.body.title,
            publicationDate: req.body.publicationDate
        };
        await createBook(book);
        return res.status(201).json(book);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Book with this ID already exists.' });
        }
        console.error('Error creating book:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBookHandler = async (req, res) => {
    const validationMessage = validateBook(req.body, writableBookFields);
    if (validationMessage) {
        return validationError(res, validationMessage);
    }

    try {
        if (!await getBookById(req.params.id)) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (!await getAuthorById(req.body.authorId)) {
            return res.status(400).json({ error: 'authorId must match an existing author.' });
        }

        const book = {
            authorId: req.body.authorId,
            title: req.body.title,
            publicationDate: req.body.publicationDate
        };
        const result = await updateBook(req.params.id, book);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(200).json(await getBookById(req.params.id));
    } catch (error) {
        console.error('Error updating book:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting book:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};
