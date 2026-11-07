import {
    getAllAuthors as getAllAuthorsFromDb,
    getAuthorById as getAuthorByIdFromDb,
    createAuthor as createAuthorInDb,
    updateAuthor as updateAuthorInDb,
    deleteAuthor as deleteAuthorFromDb,
    authorHasBooks
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error.message);
        return res.status(500).json({ error: 'Failed to fetch authors' });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const author = await getAuthorByIdFromDb(req.params.id);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        return res.status(200).json(author);
    } catch (error) {
        console.error('Error fetching author by ID:', error.message);
        return res.status(500).json({ error: 'Failed to fetch author' });
    }
};

const createAuthor = async (req, res) => {
    try {
        const newAuthor = req.body;
        await createAuthorInDb(newAuthor);
        return res.status(201).json({
            message: 'Author created successfully.',
            author: newAuthor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Author with this Id already exists.' });
        }
        console.error('Error creating author:', error.message);
        return res.status(500).json({ error: 'Failed to create author.' });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const result = await updateAuthorInDb(authorId, req.body);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Author not found.' });
        }

        const updatedAuthor = await getAuthorByIdFromDb(authorId);
        return res.status(200).json({
            message: 'Author updated successfully.',
            author: updatedAuthor
        });
    } catch (error) {
        console.error('Error updating author:', error.message);
        return res.status(500).json({ error: 'Failed to update author.' });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        const author = await getAuthorByIdFromDb(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }
        if (await authorHasBooks(authorId)) {
            return res.status(409).json({ error: 'Cannot delete an author with books.' });
        }

        const result = await deleteAuthorFromDb(authorId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Author not found.' });
        }
        return res.status(204).json({
            message: 'Author deleted successfully.',
            authors: await getAllAuthorsFromDb()
        });
    } catch (error) {
        console.error('Error deleting author:', error.message);
        return res.status(500).json({ error: 'Failed to delete author.' });
    }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
