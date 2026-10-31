import app from './app.js';
import { connectToDb } from './src/db/connect.js';


const PORT = process.env.PORT || 3000;

if (!PORT) {
    throw new Error('PORT is not defined.');
}

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server listening at 127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

await startServer();