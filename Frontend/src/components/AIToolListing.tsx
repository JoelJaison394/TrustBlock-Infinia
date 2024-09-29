import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useContracts } from "../context/ContractsContext"; 

interface AITool {
  id: number; // Changed back from string to number
  title: string;
  description: string;
  tags: string[];
  models: string[];
  imageUrl: string;
  upvotes: number;
  downvotes: number;
}

export default function AIToolListing() {
  const { submitAITool, upvoteTool, downvoteTool, connectWallet, address , tools , setTools  } = useContracts();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTool, setNewTool] = useState<Partial<AITool>>({});

  const handleVote = async (id: number, isUpvote: boolean) => {
    const tool = tools.find(tool => tool.id === id); // Find the tool by id
    if (!tool) return; // Ensure the tool exists

    if (isUpvote) {
      await upvoteTool(BigInt(id)); // Upvote in the contract
      // Update tool state in the context
      setTools(tools.map(t => 
        t.id === id ? { ...t, upvotes: (t.upvotes ?? 0) + 1 } : t
      ));
    } else {
      await downvoteTool(BigInt(id)); // Downvote in the contract
      // Update tool state in the context
      setTools(tools.map(t => 
        t.id === id ? { ...t, downvotes: (t.downvotes ?? 0) + 1 } : t
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.title || !newTool.description) {
      alert("Title and description are required.");
      return;
    }

    const id = tools.length + 1; // Generate a unique ID for the new tool based on the current length of the tools array
    const newToolData: AITool = {
      id,
      title: newTool.title,
      description: newTool.description,
      tags: newTool.tags || [],
      models: newTool.models || [],
      imageUrl: newTool.imageUrl || "",
      upvotes: 0,
      downvotes: 0,
    };

    await submitAITool(
      newToolData.title,
      newToolData.description,
      newToolData.tags?.join(", ") || "",
      newToolData.models?.join(", ") || "",
      newToolData.imageUrl || ""
    );

    setTools([...tools, newToolData]); // Add the new tool to the state
    setIsFormVisible(false);
    setNewTool({});
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI Tools</h2>
          <Button onClick={() => setIsFormVisible(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Submit AI Tool
          </Button>
        </div>

        <div className="mb-4">
          {address ? (
            <p className="text-green-500">Connected as: {address}</p>
          ) : (
            <Button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-600">
              Connect Wallet
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div key={tool.id} className="bg-gray-800 bg-opacity-80 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {tool.title}
                </h3>
                <p className="text-gray-300 mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-500 bg-opacity-20 text-blue-300 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button onClick={() => handleVote(tool.id, true)} className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors">
                      <ThumbsUp size={18} />
                      <span>{tool.upvotes}</span>
                    </button>
                    <button onClick={() => handleVote(tool.id, false)} className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors">
                      <ThumbsDown size={18} />
                      <span>{tool.downvotes}</span>
                    </button>
                  </div>
                  <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white transition-colors">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-gray-950 to-gray-900 p-8 rounded-2xl shadow-2xl text-center relative max-w-md w-full mx-4">
              <button onClick={() => setIsFormVisible(false)} className="absolute top-3 right-3 text-white hover:text-white">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">Submit AI Tool</h2>
              <form onSubmit={handleSubmit}>
                <Input
                  className="mb-4 text-white"
                  type="text"
                  placeholder="Title"
                  value={newTool.title || ""}
                  onChange={e => setNewTool({ ...newTool, title: e.target.value })}
                  required
                />
                <Textarea
                  className="mb-4 text-white"
                  placeholder="Description"
                  value={newTool.description || ""}
                  onChange={e => setNewTool({ ...newTool, description: e.target.value })}
                  required
                />
                <Input
                  className="mb-4 text-white"
                  type="text"
                  placeholder="Image URL"
                  value={newTool.imageUrl || ""}
                  onChange={e => setNewTool({ ...newTool, imageUrl: e.target.value })}
                />
                <Input
                  className="mb-4 text-white"
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newTool.tags?.join(", ") || ""}
                  onChange={e => setNewTool({ ...newTool, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                />
                <Input
                  className="mb-4 text-white"
                  type="text"
                  placeholder="Models (comma separated)"
                  value={newTool.models?.join(", ") || ""}
                  onChange={e => setNewTool({ ...newTool, models: e.target.value.split(",").map(model => model.trim()) })}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
