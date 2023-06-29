import { useState } from 'react'
import './App.css'
import { quiz } from './quiz_questions/quiz'

interface resultTypes{
  correctAnswers: number,
  wrongQuestions: Array<number>,
  wrongAnswers: Array<number>,
}

function App() {

  const [activeQuestion, setActiveQuestion] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<any>()

  const [result, setResult] = useState<resultTypes>({
    correctAnswers: 0,
    wrongQuestions: [],
    wrongAnswers: [],
  })

  const onAnswerSelected = (answer:string, index:number) => {
    setSelectedAnswerIndex(index)
    if (answer === correctAnswer) {
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  const onClickNext = () => {
    setResult((prev) =>
    selectedAnswer
      ? {
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
        }
      : { ...prev, 
          wrongQuestions:  [...prev.wrongQuestions, activeQuestion],
          wrongAnswers: [...prev.wrongAnswers, selectedAnswerIndex]
        }
    )
    setSelectedAnswerIndex(undefined)

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
    }
  }

  const onClickTryAgain = () => {
    setResult({
      correctAnswers: 0, 
      wrongAnswers: [], 
      wrongQuestions:[]
    })
    setShowResult(false)
  }

  const { questions } = quiz
  const { question, choices, correctAnswer } = questions[activeQuestion]

  return (
    <>
      <h1>Quiz</h1>
      {!showResult ? (
        <div>
          <p>{activeQuestion + 1}/4</p>
          <h2>{question}</h2>
          <ul className='quiz-list'>
            {choices.map((answer, index) => (
              <li 
              onClick={() => onAnswerSelected(answer, index)} key={index}
              className={selectedAnswerIndex === index ? 'selected-answer' : undefined}>
                {answer}
              </li>
            ))}
          </ul>
          <div>
            <button onClick={onClickNext} disabled={selectedAnswerIndex === undefined}>
              {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>Correct answers: {result.correctAnswers}</p>
          {questions.map((question, index) => {
            if(result.wrongQuestions.includes(index)){

              const answer_index = result.wrongQuestions.findIndex(answer => answer === index);

              return (
                <div key={index}>
                  <h2>{question.question}</h2>
                  <div className='result-icon false-icon'>
                    <p>False</p>
                  </div>
                  <ul>
                    {question.choices.map((answer, index) => (
                      <li key={index} className={result.wrongAnswers[answer_index] === index ? 'false-answer' : answer === question.correctAnswer ? 'correct-answer' : undefined}>
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            } else {
              return (
                <div key={index}>
                  <h2>{question.question}</h2>
                  <div className='result-icon correct-icon'>
                    <p>Correct</p>
                  </div>
                  <ul>
                    {question.choices.map((answer, index) => (
                      <li key={index} className={answer === question.correctAnswer ? 'correct-answer' : undefined}>
                        {answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
          })}
          <button onClick={onClickTryAgain}>Try again</button>
        </div>
      )}
    </>
  )
}

export default App
