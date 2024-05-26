require("dotenv").config();
const QuizModel = require("../models/QuizModel");

(async () => {
  const Quiz = new QuizModel();

  const test = await Quiz.test();

  console.log(test);
})();
