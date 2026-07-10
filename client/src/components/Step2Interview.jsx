import React, { use, useEffect, useState } from 'react'
import maleVideo from "../assets/Videos/male-ai.mp4"
import femaleVideo from "../assets/Videos/female-ai.mp4"
import Timer from './Timer'
import {motion} from "motion/react"
import {FaMicrophone,FaMicrophoneSlash} from "react-icons/fa"
import { useRef } from 'react'
import axios from "axios"
import {ServerUrl} from "../App"
import { BsArrowRight } from 'react-icons/bs'
// import { finishInterview } from '../../../server/controller/interview.controller'
const Step2Interview = ({interviewData,onFinish}) => {
  const {interviewId,questions,userName}=interviewData
  const [isIntrophase,setIsIntrophase]=useState(true)
  const [isMicon,setIsMicon]=useState(true)
  const recognitionref=useRef(null)
  const [isAIplaying,setisAIplaying]=useState(false)
  const [currentIndex,setcurrentIndex]=useState(0)
  // const [currentQuestion,setCurrentQuestion]=useState(questions[currentIndex])
  const [answers,setAnswers]=useState("")
  const [feedBack,setFeedBack]=useState("")
  const [timeLeft,setTimeLeft]=useState(questions[0]?.timeLimit || 60)
  const [selectedVoice,setselectedVoice]=useState(null)
  const [isSubmitting,setisSubmitting]=useState(false)
  const [voiceGender,setvoiceGender]=useState("female");
  const [subTitle,setsubTitle]=useState("")
  const videoRef=useRef(null) 
 const currentQuestion = questions[currentIndex]

useEffect(() => {
    const loadvoice=()=>{
      const voices=window.speechSynthesis.getVoices()
      if(!voices.length){
       return
      }
    const femaleVoice=voices.find(v=>
      v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha")
    )
    if(femaleVoice){
      setselectedVoice(femaleVoice)
      setvoiceGender("female")
      return;
    }
    
      const maleVoice=voices.find(v=>
        v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("male")
      )
      if(maleVoice){
        setselectedVoice(maleVoice)
        setvoiceGender("male")
        return;
      }

      setselectedVoice(voices[0])
      setvoiceGender("female")
    
    }
    loadvoice()
    window.speechSynthesis.onvoiceschanged=loadvoice
}, [])

const videoSource=voiceGender==="male"?maleVideo:femaleVideo



{/* speak function */}
const speakText=(text)=>{
  return new Promise((resolve)=>{
    if(!window.speechSynthesis || !selectedVoice){
      resolve();
      return;
    }
    window.speechSynthesis.cancel()
    //addd natural pause after commas and periods
   const humanText=text
   .replace(/,/g,", ... ")
   .replace(/\. /g,". ... ")

   const utterance=new SpeechSynthesisUtterance(humanText)
   utterance.voice=selectedVoice
   //human like pacing
   utterance.rate=0.92
   utterance.pitch=1.05
   utterance.volume=1

utterance.onstart=()=>{
  setisAIplaying(true)
  stopMic()
  videoRef.current?.play()
}
   utterance.onend=()=>{
    videoRef.current?.pause()
    videoRef.current.currentTime=0
    setisAIplaying(false)

if(isMicon){
  startMic()
}

    setTimeout(()=>{
      setsubTitle("")
      resolve()
    },300)
   }
   setsubTitle(humanText)
   window.speechSynthesis.speak(utterance)
  })
}

useEffect(() => {
  if(!selectedVoice){
    return;
  }

  const runIntro=async()=>{
    if(isIntrophase){
      await speakText(`Hi ${userName}, I'm InterviewIQ AI, your personal interview preparation assistant. I will guide you through the interview process step by step. Let's begin`)
      await speakText("i'll ask you a few questions .Just answer naturally ,and take your time .Let's Begin")
      setIsIntrophase(false)
    }else if(currentQuestion){
      await new Promise((r)=>{
        setTimeout(r,800)
      })
      if(currentIndex===questions.length-1){
      await speakText("Alright,this one might be a bit more challenging")
    }
     await speakText(currentQuestion.question)
     if(isMicon){
       startMic()
     }
  }

  }
runIntro()
}, [selectedVoice,isIntrophase,currentIndex])


useEffect(()=>{
if(isIntrophase) return
if(!currentQuestion) return

const timer=setInterval(()=>{
  setTimeLeft((prev)=>{
    if(prev<=1){
      clearInterval(timer)
      return 0
    }
    return prev-1
  })
},1000)
return ()=>{
  clearInterval(timer)
}

},[isIntrophase,currentIndex])
useEffect(()=>{
  if(!isIntrophase && currentQuestion){
    setTimeLeft(currentQuestion.timeLimit || 60)
  }
},[currentIndex])

useEffect(()=>{
  if(!("webkitSpeechRecognition" in window)) return
  const recognition=new window.webkitSpeechRecognition()
  recognition.lang="en-US"
  recognition.interimResults=false
  recognition.onresult=(e)=>{
    const transcript=e.results[e.results.length-1][0].transcript
    setAnswers((prev)=>
      prev + " " + transcript
    )
  }
  recognitionref.current=recognition
},[])
const startMic=()=>{
  if(recognitionref.current && !isAIplaying){
    try{
      recognitionref.current.start()
    }catch(e){
      
    }
    }
  
}

const stopMic=()=>{
  if(recognitionref.current){
    recognitionref.current.stop()
  }
}
const togglemic=()=>{
  if(isMicon){
    stopMic()
  }else{
    startMic()
  }
  setIsMicon(!isMicon)
}

const submitAnswer=async()=>{
  if(isSubmitting) return;
  stopMic()
  setisSubmitting(true)
  try{
    const result=await axios.post(ServerUrl+"/api/interview/submit-answer",{
      interviewId,
      questionIndex:currentIndex,
      answer: answers,
      timeTaken:currentQuestion.timeLimit-timeLeft
    },{withCredentials:true})
    setFeedBack(result.data.feedback)
    speakText(result.data.feedback)
    setisSubmitting(false)
  }catch(error){
    console.log(error)
    setisSubmitting(false)
  }
}

const handleNext=async()=>{
  setAnswers("")
  setFeedBack("")
  if(currentIndex+1>=questions.length){
    finishInterview()
    return;
  }
  await speakText("Alright, let's move on to the next question.")
  setcurrentIndex(currentIndex+1)
  setTimeout(()=>{
    if(isMicon){
      startMic()
    }
  },500)
}

const finishInterview=async()=>{
  stopMic()
  setIsMicon(false )
  try{
   const result = await axios.post(ServerUrl+"/api/interview/finish",{interviewId},{withCredentials:true})
console.log(result.data)
onFinish(result.data)
  }catch(error){
    console.log(error)
  }
}

useEffect(()=>{
  if(isIntrophase) return 
  if (!currentQuestion) return
  if(timeLeft===0 && !isSubmitting && !feedBack){
    submitAnswer()
  }
},[timeLeft])

useEffect(()=>{
  return ()=>{
    if(recognitionref.current){
      recognitionref.current.stop()
      recognitionref.current.abort()

    }
    window.speechSynthesis.cancel()
  }
},[])
  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
        <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
    
    
    
          {/* {video section} */}
              <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
              <div className=''>
                <video src={videoSource}
                key={videoSource}
                ref={videoRef} 
                muted
                playsInline
                preload='auto'
                className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl' />
                

              </div>
              {/* {subtitle } */}
              {subTitle && (
                <div className='w-full max-w-md bg-gray-50 border border-gray-200
                rounded-xl p-4 shadow-sm'>
                  <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed '>{subTitle}</p>
                </div>
              )}



              {/* {timer area} */}
              <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-500'>Interview Status</span>
                  {isAIplaying && <span className='text-sm font-semibold text-emerald-600'>{isAIplaying ? "AI Speaking":""}</span>}
                </div>
                <div className='h-px bg-gray-200'></div>
                <div className='flex justify-center'>
                  <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit }/>
                </div>
                <div className='h-px bg-gray-200 '>

                </div>
                <div className='grid grid-cols-2 gap-6 text-center'>
                  <div>
                    <span className='text-2xl font-bold text-emerald-600'>{currentIndex+1}</span>
                    <span className='text-xs text-gray-400 '>Current Questions</span>
                  </div>
                  <div>
                    <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                    <span className='text-xs text-gray-400 '>Total questions</span>
                  </div>
                </div>
              </div>
              </div>
              {/* {Text Section} */}
              <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
                <h2 className=' text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
                  AI Smart Interview
                </h2>
                {!isIntrophase && <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
                  <p className='text-xs sm:text-sm text-gray-400 mb-2'> 
                    Question {currentIndex+1} of {questions.length}
                  </p>
                  <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16'>{currentQuestion?.question}</div>
                </div>}
                <textarea placeholder='Type your answer here' 
                onChange={(e)=>
                  setAnswers(e.target.value)
                }
                value={answers}
                className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 '/>
                {!feedBack ? (<div className='flex items-center gap-4 mt-6'>
                  <motion.button
                  onClick={togglemic}
                  whileTap={{scale:0.9}}
                  
                  className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white  shadow-lg'>
                  { isMicon?<FaMicrophone size={20}/>:<FaMicrophoneSlash size={20}/>}

                  </motion.button>
                  <motion.button
                  onClick={submitAnswer}
                  disabled={isSubmitting}
                  
                  whileTap={{scale:0.95}}
                  className=' flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opaccity-90 transition font-semibold disabled:bg-gray-500'>
                   {isSubmitting ? "Submitting..." : "Submit Answer"}
                
                  </motion.button>
                </div>):(
                  <motion.div
                  initial={{opacity:0}}
                  animate={{opacity:1}}
                  
                  className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm' >
                    <p className='font-medium mb-4 text-emerald-700'>{feedBack}</p>
                    <button 
                    onClick={handleNext}
                    className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3  rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>
                      Next Question <BsArrowRight size={18}/>
                    </button>
                </motion.div>
              )}
              </div>
        </div>
    </div>
  )
}

export default Step2Interview