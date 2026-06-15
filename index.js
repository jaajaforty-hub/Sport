import bcrypt from "bcrypt";
import express from "express";
import {Pool} from "pg";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();



const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.get("/", (req, res) => res.sendFile("login.html", { root: "loginRegister" }));
app.get("/login", (req, res) => res.sendFile("login.html", { root: "loginRegister" }));
app.get("/register", (req, res) => res.sendFile("register.html", { root: "loginRegister"}));



app.post("/register", async (req, res) => {
    const { Email, Password, ConfirmPassword, KEY } = req.body;


    try {

        if (!Email || !Password || !ConfirmPassword || !KEY) {
            return res.status(400).json({
                message: "All fields are required",
                color: "red"
            });
        }

        const checkUser = await db.query(
            "SELECT email FROM users WHERE email=$1",
            [Email]
        )

        if(checkUser.rows.length > 0){
            return res.status(400).json({ message: "The user is already exist "})
        }

        if(Password !== ConfirmPassword){
            return res.status(400).json({ message: "Passwords should match", color: "red" })
        }

        const getKey = await db.query(
            "SELECT value FROM access_key WHERE key=$1",
            ["register_key"]
        );

        const check_KEY = await bcrypt.compare(KEY,getKey.rows[0].value) 
        if(!check_KEY){
            return res.status(401).json({ message: "Invalid key", color: "red" })
        }

        const hashed = await bcrypt.hash(Password,10)
        await db.query("INSERT INTO users(email,password) VALUES($1,$2)",
            [Email,hashed]
        )

        res.json({ message: "Registered successfully", color: "green" });

    } catch (e) {
        res.status(500).json({ message: "Registration error", color: "red" });
    }
});


app.post("/login", async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    
    try {
        const result = await db.query(
            "SELECT email, password FROM users WHERE email=$1",
            [loginEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found", color: "red" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(loginPassword, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials", color: "red" });
        }

        const token = jwt.sign(
            { user: user.email },
            process.env.ACCESS_KEY,
            { expiresIn: "2h" }
        );

        res.cookie("token",token ,{
            httpOnly:true,
            secure:false,
            //sameSite:"strict",

        })

        res.json({ success: true });

    } catch (e) {
        res.status(500).json({ message: "Login error", color: "red" });
    }
});

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        return res.redirect("/login");
    }
}

app.get("/soccer", auth, (req, res) => {
    res.sendFile("soccer.html",{root: "public"})
});
app.get("/nfl", auth, (req, res) => {
    res.send("Only soccer is available, NFL predictions will be available soon ")
});
app.get("/basketball", auth, (req, res) => {
    res.send("Only soccer is available, BASKETBALL predictions will be available soon ")
});
app.get("/volleyball", auth, (req, res) => {
    res.send("Only soccer is available, VOLLEYBALL predictions will be available soon ")
});
app.get("/hockey", auth, (req, res) => {
    res.send("Only soccer is available, HOCKEY predictions will be available soon ")
});

app.get("/api/data", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM teams");

    return res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
    console.log(result.rows)

  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});



app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    return res.redirect("/login");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

