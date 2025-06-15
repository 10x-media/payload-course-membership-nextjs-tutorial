'use client'

import { Participation } from '@/payload-types'
import { useEffect, useState } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import NextButton from './NextButton'
import { markProgress } from '../_actions/markProgress'

export default function QuizModule({
  module,
  participation,
  onCompleted,
}: {
  module: any
  onCompleted: (nextIndex: number) => void
  participation: Participation
}) {
  const [message, setMessage] = useState('')
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(false)

  useEffect(() => {
    setEmptyUserAnswers()
  }, [])

  function setEmptyUserAnswers() {
    let temp = []

    temp = module.questions.map((question: any) => {
      return question.answers.map(() => {
        return false
      })
    })

    setUserAnswers(temp)
  }

  function checkAnswer(i: number) {
    let correct = true
    let length = module.questions[i].answers.length

    for (let n = 0; n < length; n++) {
      let val = module.questions[i].answers[n].true
        ? module.questions[i].answers[n].true
        : false
      if (val !== userAnswers[i][n]) {
        correct = false
      }
    }
    return correct
  }

  function checkAllAnswers() {
    for (let i = 0; i < module.questions.length; i++) {
      if (!checkAnswer(i)) {
        return false
      }
    }
    return true
  }

  async function handleNextModule() {
    setLoading(true)
    try {
      let updatedParticipation = await markProgress(participation)
      if (updatedParticipation && updatedParticipation.progress) {
        onCompleted(updatedParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
      }
    } catch (error) {
      console.error('Error marking progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>
      <div className="relative w-full aspect-video border border-white p-6 overflow-hidden">
        {module.questions.map((question: any, i: number) => {
          return (
            <div key={i} className="flex flex-row gap-2  mb-6">
              <div className="flex flex-col gap-4 ">
                <p className={`font-bold`}>
                  {i + 1}. {question.question}
                </p>
                {question.answers.map((answer: any, index: number) => {
                  return (
                    <div
                      className="flex items-center cursor-pointer"
                      key={`${i}-${index}-${answer}`}
                    >
                      <input
                        id={'default-checkbox' + index}
                        type="checkbox"
                        onClick={(e) => {
                          setMessage('')
                          let tempAns = JSON.parse(JSON.stringify(userAnswers))

                          tempAns[i][index] = e.target.checked
                          setUserAnswers(tempAns)
                        }}
                        className={`h-4 w-4 text-teal-500 bg-gray-100 border-gray-300 rounded-full focus:ring-teal-400  focus:ring-2`}
                      />
                      <label
                        htmlFor={'default-checkbox' + index}
                        className={`ml-4 cursor-pointer font-medium text-white text-2xl`}
                      >
                        {answer.answer}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {message && <div className={`text-red-500 p-2 text-end fond-bold `}>{message}</div>}
      <div className="flex flex-col gap-4 justify-start">
        <div className="flex">
          {allAnswersCorrect ? (
            <NextButton loading={loading} text="Next" onClick={handleNextModule} />
          ) : (
            <button
              disabled={allAnswersCorrect}
              className={`${allAnswersCorrect ? 'btn-primary-outline' : 'btn-primary'}`}
              onClick={() => {
                if (checkAllAnswers()) {
                  setUserAnswers([])
                  setAllAnswersCorrect(true)
                } else {
                  setMessage(
                    'Not all answers are correct. Please check your answers again. Multiple answers can be correct.',
                  )
                }
              }}
            >
              <div className="flex gap-2 items-center">
                <span>Check Answers</span>
                <HiArrowRight className="h-4 w-4" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
