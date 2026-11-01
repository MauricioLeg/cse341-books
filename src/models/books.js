import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = await db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
}

export { getAllBooks };