import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import { useContracts } from "@/context/ContractsContext"; // Adjust the import path as needed

export default function Header() {
  const { connectWallet, disconnectWallet, address } = useContracts();

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
              <path
                fillRule="evenodd"
                d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
           TrustBlock
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {address && (
            <span className="text-sm text-gray-300">{address}</span>
          )}
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
            onClick={address ? disconnectWallet : connectWallet} // Toggle between connect and disconnect
          >
            <WalletIcon className="w-4 h-4 mr-2" />
            {address ? "Disconnect Wallet" : "Connect Wallet"}
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#ffffff03_0,_#ffffff00_50%)] animate-pulse"></div>
      </div>
    </header>
  );
}
