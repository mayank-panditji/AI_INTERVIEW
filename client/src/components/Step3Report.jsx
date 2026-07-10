import React from 'react'
import { useNavigate } from 'react-router-dom'
import {FaArrowLeft} from "react-icons/fa"
import { motion } from 'framer-motion'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Area} from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
const step3Report = ({report}) => {
   if(!report) {return (<div className='min-h-screen flex items-center justify-center'>
        <p className="text-gray-500 text-lg">Loading Report...</p>
    </div>
   )
  }
  const navigate = useNavigate();
  const {
    finalScore=0,
    confidence=0,
    communication=0,
    correctness=0,
    questionWiseScore=[],
  }=report;
  const QuestionScoreData=questionWiseScore.map((q,i)=>{
    return {
      name:`Q${i+1}`,
      score:q.score||0,
    }
  })
  const skills=[
    {label:"Confidence",value:confidence},
    {label:"Communication",value:communication},
    {label:"Correctness",value:correctness},
  ]
  let performanceText=""
  let shortTagline=""
  if(finalScore>=8){
    performanceText="You did well in the interview"
    shortTagline="You did well in the interview"
  }else if(finalScore>=5){
    performanceText="You did okay in the interview"
    shortTagline="You did okay in the interview"
  }
  else{
    performanceText="Significant improvement required"
    shortTagline="works on improving your performance"
  }
  const score=finalScore
  const percentage=(score/10)*100

  const downloadPDF=()=>{
    const doc=new jsPDF("p","mm","a4" )
    const pageWidth=doc.internal.pageSize.getWidth()
    const margin =20;
    const contentWidth=pageWidth-2*margin;
    let currentY=25
   
    //TITLE

    doc.setFont("helvetica","bold")
    doc.setFontSize(20)
    doc.setTextColor(34,197,94)
    doc.text("Ai Interview Performance Report",pageWidth/2,currentY,{align:"center"})
    currentY+=5
    // underline
    doc.setDrawColor(34,197,94)
    doc.line(margin , currentY+2,pageWidth-margin, currentY+2)
    currentY+=15
    //final score box
    doc.setFillColor(240,253,244)
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F")
    doc.setFontSize(14)
    doc.setTextColor(0,0,0)
    doc.text(`Final Score :${finalScore}/10`,
      pageWidth/2,
      currentY+12,
    {align:"center"})
      currentY+=30

      //skill box
      doc.setFillColor(249,250,251)
      doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F")
      doc.setFontSize(12)
      
      doc.text(`confidence:${confidence}`,
      margin+10,
      currentY+10)

      doc.text(`communication:${communication}`,
      margin+10,
      currentY+18)

      doc.text(`correctness:${correctness}`,
      margin+10,
      currentY+26)
      currentY+=45

      //ADVICE
      let advice=""
      if(finalScore>=8){
        advice="Excellence performance .Maintain confdence and structure .Continue refining clarity and supporting answer with strong real word examples"
      }else if(finalScore>=5){
        advice="Good foundation shown . Improve clarity and structure Practice delivery in concise ,confident answer with stronger supporting examples"
      }
      else{
        advice="Significant improvement required.Focus on structured thinking and practice delivery.Improve clarity and structure.Practice delivery in concise ,confident answer with stronger supporting examples"
      }
      doc.setFillColor(249,250,251)
      doc.setDrawColor(220)
      doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4, )
      doc.setFont("helvetica","bold")
      doc.text("Professional advice ",margin+10,currentY+10)
      doc.setFont("helvetica","normal")
      doc.setFontSize(11)
      const splitAdvice=doc.splitTextToSize(advice, contentWidth-20)
      doc.text(splitAdvice,margin+10,currentY+20)
      currentY+=50
      //table
      autoTable(doc, {
        startY: currentY,
        margin: {
          left: margin,
          right: margin},
          head: [["#","Question","Score","Feedback"]],
        body: questionWiseScore.map((q,i)=>[
          `${i+1}`,
          q.question,
          `${q.score}/10`,
          q.feedback
        ]),
        styles:{
            fontSize:9,
            cellPadding:5,
            valign:"top",

        },
        headStyles: {
            halign:"center",
            
            fillColor:[34,197,94],
            textColor:255,
            
        },
        alternateRowStyles: {
          fillColor: [249,250,251],
        },

       
      })
      doc.save("AI_Interview_Report.pdf")

 
 
 
  }

  
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8'>
      
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='md:mb-10 w-full items-start gap-4 flex '>
                        <button 
                        onClick={()=>navigate('/history')}
                        className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-600'/></button>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>
                                Interview Analytics Dashboard
                            </h1>
                            <p className='text-gray-500 mt-2'>
                               AI powered performance insights
                            </p>
                        </div>
                    </div>
                    <button 
                    onClick={downloadPDF}
                    className='bg-emerald-600 hover:bg-emerald-700 text-white
                     px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap'>Download Pdf</button>
      </div>

    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
      <div className='space-y-6'>
        
        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center'>
          <h3 className='text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base'>Overall Performance</h3>
              <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto '>
                    <CircularProgressbar value={percentage} text={`${score}/10`}
                    styles={
                        buildStyles({
                            textSize:"18px",
                            pathColor:"#10b981",
                            textColor:"ef4444",
                            trailColor:"#e5e7eb"
                        }) } 
                   
                    />
                </div>
          <div className='mt-4 '>
            <p className='font-semibold text-gray-800 text-sm sm:text-base '>{performanceText}</p>
            <p className='text-gray-500 text-xs sm:text-sm mt-1 '>{shortTagline}</p>
          </div>
        </motion.div>

      <motion.div 
       initial={{opacity:0}}
        animate={{opacity:1}}
      className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 '>
          <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-6'>Skill Evaluation</h3>
          <div className='space-y-5'>
            {skills.map((s,i)=>(
              <div key={i}>
                <div className='flex  justify-between mb-2 text-sm sm:text-base'>
                  <span>{s.label}</span>
                  <span className='font-semibold text-green-600'>{s.value}</span>
                </div>
                <div className='bg-gray-200 h-2 sm:h-3 rounded-full'>
                  <div className='bg-green-500 h-full rounded-full' style={{width:`${s.value*10}%`}}>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
      </motion.div>

      </div>
      <div className='lg:col-span-2 space-y-6'>
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 '
            >
                <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6'>
                  Performance Trend
                </h3>
                <div className='h-64 sm:h-72'>
                  <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={QuestionScoreData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="score" stroke="#22c55e" fill="#bbf7d0"
                          strokeWidth={3} />
                        </AreaChart>
                  </ResponsiveContainer>
                </div>

            </motion.div>
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}} 
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'
            >
              <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-6'>Question Breakdown</h3>
              <div className='space-y-6'>
                {questionWiseScore.map((q,i)=>(
                    <div key={i} className='bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200'>
                      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4'>
                        <div>
                          <p className='text-xs text-gray-400'> Question {i+1}</p>
                          <p className='font-semibold text-gray-800 text-sm sm:text-base leading-relaxed'>
                            {q.question || 'Question not found'}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-semibold text-green-600'>{q.score ?? 0}/10</p>
                        </div>
                      </div>
                      <div className='bg-green-50 border border-green-200 p-4 rounded-lg'>
                        <p className='text-xs text-green-600 font-semibold mb-1'>AI Feedback</p>
                        <p className='text-sm text-gray-700 leading-relaxed'>
                          {q.feedback && q.feedback.trim() !="" ? q.feedback : "No feedback provided"}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
      </div>
    </div>

    </div>
  )
}

export default step3Report