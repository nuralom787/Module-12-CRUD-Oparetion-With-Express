import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

// ? Parser
app.use(express.json());
app.use(express.urlencoded()); // * Using For Getting Form Data In Body.

// DB.
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
});

const initDB = async () => {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            age INT,
            phone VARCHAR(15),
            address TEXT,
            createdAt TIMESTAMP DEFAULT NOW(),
            updatedAt TIMESTAMP DEFAULT NOW()
            )
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        createAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        )
        `);
};

initDB()


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Node-express!')
});


app.post("/users", async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const result = await pool.query(`INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`, [name, email]);
        // console.log(result.rows[0]);

        res.status(200).json({
            success: true,
            message: 'Data inserted Successfully!',
            data: result.rows[0]
        });
    }
    catch (err: any) {
        res.status(500).json({
            message: err.message,
            success: false
        })
    }


    res.status(201).json({ message: "ok", success: true });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
