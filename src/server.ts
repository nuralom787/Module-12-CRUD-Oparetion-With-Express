import express, { NextFunction, Request, Response } from "express";
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

initDB();

// Logger Middleware.
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method}`);
};



// * -----------------  Users Related APIS ------------------ *//


// ! users CRUD.
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
    // res.status(201).json({ message: "ok", success: true });
});


// ! Get All users.
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `);
        res.status(200).json({
            success: true,
            message: "Users retrieved Successfully!",
            data: result.rows
        })
    }
    catch (err: any) {
        // console.log(err);    
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
});


// ! Get Single Users.
app.get("/users/:id", async (req: Request, res: Response) => {
    // console.log(req.params);

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: "user Founded",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
});


// ! Update User Route.
app.put("/users/:id", async (req: Request, res: Response) => {
    // console.log(req.params);
    const { name, email } = req.body;

    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: "user Updated Successfully",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
});


// ! Delete User.
app.delete("/users/:id", async (req: Request, res: Response) => {
    // console.log(req.params);

    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found!"
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: "user Deleted Successfully.",
                data: result.rows
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
});



// * --------------------- todos Related APIS ----------------------- * //


app.post("/todos", async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1, $2) RETURNING *`, [user_id, title]);

        res.status(200).json({
            success: true,
            message: "Todo Created.",
            data: result.rows[0]
        })
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ! Get All todos.
app.get("/todos", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM todos
            `);
        res.status(200).json({
            success: true,
            message: "Todos retrieved Successfully!",
            data: result.rows
        })
    }
    catch (err: any) {
        // console.log(err);    
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        });
    }
});




// ! ----------------------- NOT FOUND ---------------------- ! //

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found!",
        path: req.path
    })
})



// * Default Apis.

// ! Default get Route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello Node-express!')
});


// !  listening route.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
