import YoutubeInputBar from "@/components/YoutubeInputBar"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute top-6 left-8 text-4xl font-extrabold text-primary select-none z-50">ytc-analyzer</div>
      <YoutubeInputBar />
    </div>
  )
}

export default App
