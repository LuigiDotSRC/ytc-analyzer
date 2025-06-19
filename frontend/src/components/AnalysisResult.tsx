import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function generateSentimentTable(sentimentData: Array<{ id: string, author: string, text: string, like_count: number, sentiment: string }>) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "POS":
        return "bg-green-100";
      case "NEG":
        return "bg-red-100";
      case "NEU":
        return "bg-gray-100";
      default:
        return "bg-white";
    }
  };

  return (
    <Table>
      <TableCaption>Sentiment Analysis Results</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Comment ID</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Text</TableHead>
          <TableHead>Like Count</TableHead>
          <TableHead>Sentiment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sentimentData.map((item: { id: string, author: string, text: string, like_count: number, sentiment: string }) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id || 'N/A'}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell className="max-w-xs break-words whitespace-normal">
              {item.text.split(' ').length > 25
                ? item.text.split(' ').slice(0, 25).join(' ') + '...'
                : item.text
              }
            </TableCell>
            <TableCell>{item.like_count || 0}</TableCell>
            <TableCell className={`${getSentimentColor(item.sentiment)} font-semibold`}>
              {item.sentiment}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AnalysisResult({ analysis }: { analysis: { summary: any, sentiment: any } }) { 

  return (
    <div className="mt-8 mx-auto w-1/2">
        <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
        <p><strong>Summary:</strong> {analysis.summary.summary}</p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Sentiment Analysis</h3>
          {generateSentimentTable(analysis.sentiment.comments)}
        </div>
    </div>
  )
}

export default AnalysisResult