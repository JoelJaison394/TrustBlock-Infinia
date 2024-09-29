import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useContracts } from "@/context/ContractsContext" // Adjust the import path as needed
import { X } from "lucide-react"

export default function HeroSection() {
  const [isPopupVisible, setPopupVisible] = useState(false)
  const { connectWallet, address } = useContracts()

  const handleGetStarted = () => {
    setPopupVisible(true)
  }

  const handleConnectWallet = async () => {
    await connectWallet()
    // After connecting, you can handle any additional logic here
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #4f4f4f33 1px, transparent 1px),
              linear-gradient(to bottom, #4f4f4f33 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
          Empower Your Online Safety
        </h1>
        <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-300 mb-10">
          Join our community-driven platform to review and monitor AI models and websites for a safer digital experience.
        </p>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
      
      {/* Popup for wallet connection */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl text-center relative max-w-md w-full mx-4">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setPopupVisible(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Connect Your Wallet
            </h2>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-4"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
            {address ? (
              <div className="mt-6 text-gray-300">
                <p className="mb-2">
                  Thank you for connecting!
                </p>
                <p className="text-sm">
                  Please follow the community rules to help make our community better. Stay active by upvoting and downvoting.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Connect your wallet to access all features and participate in our community.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
    </section>
  )
}