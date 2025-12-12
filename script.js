import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "qwerty123",
  port: 5432
})
let quiz = [];
let totalScore = 0;

const connectToDB = async () => {
    try {
        await db.connect();
        const res =  await db.query("SELECT * FROM capitals");
        quiz = res.rows;
        console.log("Connected to the database");
    } catch (err) {
        console.error("Error connecting to the database", err.stack);
    }finally {
        await db.end();
    }
   

};
await connectToDB();
let currentQuestion={};


const random_quiz = () => {
    currentQuestion =  quiz[Math.floor(Math.random() * quiz.length)];
}




const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    totalScore = 0;
    random_quiz();
    console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion});
});


app.post("/submit", (req, res) => {
    try {
        let userAnswer = req.body.answer.trim();    
    let correctAnswer = currentQuestion.capital;
    let isCorrect = false;
    correctAnswer = currentQuestion.capital;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()){
        isCorrect = true;
        totalScore += 1;
    }else{
        isCorrect = false;
    }
    random_quiz();
    console.log(currentQuestion);
    res.render("index.ejs", { question: currentQuestion, totalScore: totalScore, wasCorrect: isCorrect });
    console.log(`User answered: ${userAnswer}, Correct answer: ${correctAnswer}, Is correct: ${isCorrect}, Total score: ${totalScore}`);
    } catch (error) {
        console.error("Error processing the answer", error);
    }
    


})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

