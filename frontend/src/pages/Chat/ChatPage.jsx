import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, RefreshCw } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import colors from "@/constants/colors"
import { getHistory, createQuery } from "@/services/api/rag"
import { useAuth } from "@/context/AuthContext"
import chatImage from "@/assets/images/chat.jpg"
const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Gita, your AI assistant. I'm here to help you with any questions or tasks you might have. How can I assist you today?",
      isUser: false,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const auth = useAuth()

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistory()
        if (history && history.rag && history.rag.queries) {
          const historicalMessages = history.rag.queries.flatMap((query) => [
            { text: query.queryText, isUser: true },
            { text: query.responseText, isUser: false },
          ])
          setMessages((prev) => [...prev, ...historicalMessages])
        }
      } catch (error) {
        // handle
      }
    }

    fetchHistory()
  }, [])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { text: inputMessage, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Show typing dots
    setMessages((prev) => [...prev, { text: "", isUser: false, isTyping: true }])

    try {
      const response = await createQuery(inputMessage)

      // Remove typing animation
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))

      if (response && response.rag) {
        const aiMessage = {
          text: response.rag.queries[response.rag.queries.length - 1].responseText,
          isUser: false,
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isTyping),
        {
          text: "Sorry, something went wrong. Please try again.",
          isUser: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen p-4" style={{ backgroundColor: colors.paleBeige }}>
      <Card className="flex flex-col h-full" style={{ backgroundColor: colors.offWhite, borderColor: colors.darkRed }}>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4" style={{ backgroundColor: colors.lightBeige }}>
        {messages.map((message, index) => (
  <div key={index} className={`flex items-start ${message.isUser ? "justify-end" : "justify-start"}`}>
    {!message.isUser && (
      <div className="mr-2 mt-2">
        <Avatar className="h-8 w-8 border border-red-200">
          <AvatarImage src={chatImage} alt="Gita" />
          <AvatarFallback style={{ backgroundColor: colors.deeperRed, color: "white" }}>GA</AvatarFallback>
        </Avatar>
      </div>
    )}

    <div
      className={`max-w-[70%] p-3 rounded-lg shadow-sm border ${
        message.isUser
          ? "bg-white text-black border-red-600"
          : "bg-white text-black border-red-300"
      }`}
    >
      {message.isTyping ? (
        <div className="flex space-x-1 items-center justify-start">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      ) : (
        message.text
          .split('\n')  // Split by new lines
          .map(line => line.trim())  // Remove leading/trailing whitespace
          .filter(line => line && line !== '*')  // Only filter empty lines and single asterisks
          .map((line, i) => {
            // Process formatting but keep content with asterisks
            const cleaned = line.replace(/^\*+\s?/, '')  // Remove only leading asterisks followed by space
            return (
              <p key={i} className="mb-1 leading-relaxed">
                {message.isUser ? cleaned : `• ${cleaned}`}  {/* Add bullet for non-user messages */}
              </p>
            )
          })
        )
      }
    </div>

    {message.isUser && (
      <div className="ml-2 mt-2">
        <Avatar className="h-8 w-8 border border-red-200">
          <AvatarImage src={auth.user?.avatar} alt="You" />
          <AvatarFallback style={{ backgroundColor: colors.deeperRed, color: "white" }}>ME</AvatarFallback>
        </Avatar>
      </div>
    )}
  </div>
))}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t" style={{ borderColor: colors.darkRed }}>
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-grow"
              style={{ borderColor: colors.softRed, backgroundColor: colors.offWhite }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              style={{ backgroundColor: colors.deeperRed, color: "white" }}
            >
              {isLoading ? <RefreshCw className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ChatPage
