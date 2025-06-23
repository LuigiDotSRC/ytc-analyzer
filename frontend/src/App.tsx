import YoutubeInputBar from "@/components/YoutubeInputBar"
import AnalysisResult from "@/components/AnalysisResult"
import { useState, useRef, useEffect } from "react"

function App() {
  const [analysis, setAnalysis] = useState<{ summary: any, sentiment: any } | null>(null)

  const handleAnalysisComplete = (analysis: { summary: any, sentiment: any }) => {
    setAnalysis(analysis)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-6 left-8 text-4xl font-extrabold text-primary select-none z-50">ytc-analyzer</div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <YoutubeInputBar onAnalysisComplete={handleAnalysisComplete} />
      </div>
      {analysis && (
        <ScrollToAnalysisWrapper>
          <AnalysisResult analysis={analysis} />
        </ScrollToAnalysisWrapper>
      )}
    </div>
  )
}

function ScrollToAnalysisWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [children])

  return <div ref={ref}>{children}</div>
}

export default App


