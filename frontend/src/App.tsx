import YoutubeInputBar from "@/components/YoutubeInputBar"
import { useState } from "react"

function App() {
  const [analysis, setAnalysis] = useState<{ summary: any, sentiment: any } | null>(null)

  const handleAnalysisComplete = (analysis: { summary: any, sentiment: any }) => {
    setAnalysis(analysis)
    console.log(`Summary: ${analysis.summary} \nSentiment: ${analysis.sentiment}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-6 left-8 text-4xl font-extrabold text-primary select-none z-50">ytc-analyzer</div>
      <YoutubeInputBar onAnalysisComplete={handleAnalysisComplete} />
      {analysis && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          <p><strong>Summary:</strong> {JSON.stringify(analysis.summary, null, 2)}</p>
          <p><strong>Sentiment:</strong> {JSON.stringify(analysis.sentiment, null, 2)}</p>
        </div>
      )}
    </div>
  )
}

export default App
