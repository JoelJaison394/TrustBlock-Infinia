/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createWalletClient, custom, PublicClient, createPublicClient, http, WalletClient, Address, Abi } from 'viem';
import { polygonAmoy } from 'viem/chains';
import AIFirewallList_ABI from '../abis/AIFirewallList.json';
import AIToolSubmission_ABI from '../abis/AIToolSubmission.json';
import AIToolVoting_ABI from '../abis/AIToolVoting.json';
import { v4 as uuidv4 } from 'uuid';

const AIFirewallList_ABI_Only = AIFirewallList_ABI.abi as Abi;
const AIToolSubmission_ABI_Only = AIToolSubmission_ABI.abi as Abi;
const AIToolVoting_ABI_Only = AIToolVoting_ABI.abi as Abi;

const safetyConcerns = [
  "Data Privacy: Ensure that user data is handled according to privacy regulations and not shared without consent.",
  "Misinformation: Evaluate the accuracy of the information generated to prevent the spread of false or misleading content.",
  "Bias and Fairness: Assess the model for potential biases in training data that could lead to unfair outcomes.",
  "User Safety: Implement measures to prevent harmful outputs, such as hate speech or incitement to violence.",
  "Dependency Risks: Consider the implications of users relying too heavily on the AI tool for decision-making.",
  "Compliance: Ensure that the tool complies with all relevant laws and regulations in the jurisdictions it operates."
];

declare global {
  interface Window {
    ethereum: any;
  }
}

interface AITool {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  flags: string[];
  tags: string[];
  models: string[];
  safetyConcerns: string[];
  submitter: Address;
  upvotes?: number;   // Optional for fetched tool votes
  downvotes?: number; // Optional for fetched tool votes
}

interface Contract {
  address: Address;
  abi: Abi;
  client: WalletClient;
}

interface Contracts {
  aitoolSubmission: Contract | null;
  aitoolVoting: Contract | null;
  aifirewallList: Contract | null;
}

interface ContractsContextType {
  address: Address | null;
  connectWallet: () => Promise<void>;
  submitAITool: (title: string, description: string, tags: string, model: string, imageUrl: string) => Promise<void>;
  upvoteTool: (toolId: bigint) => Promise<void>;
  downvoteTool: (toolId: bigint) => Promise<void>;
  generateFirewallList: () => Promise<void>;
  disconnectWallet: () => void;
  tools: AITool[];
  setTools: React.Dispatch<React.SetStateAction<AITool[]>>;
  fetchVotesForTools: () => Promise<void>; // New function
}

const ContractsContext = createContext<ContractsContextType | null>(null);

export const ContractsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<Address | null>(null);
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [contracts, setContracts] = useState<Contracts>({
    aitoolSubmission: null,
    aitoolVoting: null,
    aifirewallList: null,
  });

  const [tools, setTools] = useState<AITool[]>([]);

  const ALCHEMY_RPC_URL = 'https://polygon-amoy.g.alchemy.com/v2/JnWQIljVFhSUEewAEEbi4D5Tbrwo1gBS'; 
  const AIToolSubmission_ADDRESS = '0x9a30Cd8D0057362DD2C299138a8bFc4024c951C1' as Address;
  const AIToolVoting_ADDRESS = '0xDb45C8683e372465a8f20c69bE54Be333299112a' as Address;
  const AIFirewallList_ADDRESS = '0xCaFf54cc69025c0c2FbC11cD94964dAD59186A97' as Address;

  useEffect(() => {
    const newPublicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(ALCHEMY_RPC_URL),
    });
    setPublicClient(newPublicClient);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await loadWallet();
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const loadWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const wallet = createWalletClient({
          chain: polygonAmoy,
          transport: custom(window.ethereum),
        });
        setAddress(accounts[0] as Address);
        setWalletClient(wallet);
        loadContracts(wallet);
      } else {
        console.log('No authorized accounts found');
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const loadContracts = (walletClient: WalletClient) => {
    const aitoolSubmission: Contract = {
      address: AIToolSubmission_ADDRESS,
      abi: AIToolSubmission_ABI_Only,
      client: walletClient,
    };

    const aitoolVoting: Contract = {
      address: AIToolVoting_ADDRESS,
      abi: AIToolVoting_ABI_Only,
      client: walletClient,
    };

    const aifirewallList: Contract = {
      address: AIFirewallList_ADDRESS,
      abi: AIFirewallList_ABI_Only,
      client: walletClient,
    };

    setContracts({
      aitoolSubmission,
      aitoolVoting,
      aifirewallList,
    });
  };

  const fetchAllTools = async () => {
    try {
      if (contracts.aitoolSubmission) {
        if (!publicClient) {
          console.error('Public client is not initialized.');
          return;
        }
        const totalTools = await publicClient.readContract({
          abi: contracts.aitoolSubmission.abi,
          address: contracts.aitoolSubmission.address,
          functionName: 'toolCount',
          args: [],
        });
  
        const fetchedTools: AITool[] = [];
        const totalToolsNumber = totalTools as number;
        for (let i = 1; i <= totalToolsNumber; i++) {
          if (!publicClient) {
            console.error('Public client is not initialized.');
            return;
          }
          const tool = await publicClient.readContract({
            abi: contracts.aitoolSubmission.abi,
            address: contracts.aitoolSubmission.address,
            functionName: 'getTool',
            args: [i],
          });
  
          fetchedTools.push(tool as AITool);
        }
  
        setTools(fetchedTools); // Update the tools state
        console.log('Fetched Tools:', fetchedTools);
      } else {
        console.error('AIToolSubmission contract is not loaded.');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      if (error instanceof Error && 'response' in error) {
        console.error('Error details:', (error as any).response);
      }
    }
  };
  

  // New function to fetch votes for each tool
  const fetchVotesForTools = async () => {
    try {
      if (!publicClient || !contracts.aitoolVoting) {
        console.error('Public client or AIToolVoting contract is not initialized.');
        return;
      }

      const updatedTools = await Promise.all(
        tools.map(async (tool) => {

          const [upvotes, downvotes] = await publicClient.readContract({
            abi: contracts.aitoolVoting!.abi,
            address: contracts.aitoolVoting!.address,
            functionName: 'getVotes',
            args: [tool.id],
          }) as [bigint, bigint];

          return {
            ...tool,
            upvotes: Number(upvotes),    // Convert BigInt to number
            downvotes: Number(downvotes), // Convert BigInt to number
          };
        })
      );

      setTools(updatedTools);
    } catch (error) {
      console.error('Error fetching votes for tools:', error);
    }
  };

  // Call fetchAllTools when the component mounts or when contracts change
  useEffect(() => {
    fetchAllTools();
  }, [contracts]);

  // Call fetchVotesForTools whenever tools are fetched
  useEffect(() => {
    if (tools.length > 0) {
      fetchVotesForTools();
    }
  }, [tools]);

  const submitAITool = async (title: string, description: string, tags: string, model: string, imageUrl: string) => {
    try {
      if (!address || !walletClient) {
        console.error('No address or wallet client found. Please connect your wallet.');
        return;
      }

      if (contracts.aitoolSubmission) {
        const tx = await walletClient.writeContract({
          abi: contracts.aitoolSubmission!.abi,
          address: contracts.aitoolSubmission!.address,
          functionName: 'submitTool',
          args: [title, description, imageUrl, [],[],[],[]],
          chain: undefined,
          account: address as `0x${string}`
        });

        if (!publicClient) {
          console.error('Public client is not initialized.');
          return;
        }
        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log('Transaction receipt:', receipt);
        console.log('Tool submitted successfully:', tx);
        await fetchAllTools();  // Refresh the tool list after submission
      }
    } catch (error) {
      console.error('Error submitting AI Tool:', error);
    }
  };

  const upvoteTool = async (toolId: bigint) => {
    if (!address || !walletClient) {
      console.error('No address or wallet client found. Please connect your wallet.');
      return;
    }

    console.log('Upvoting tool:', toolId);

    if (contracts.aitoolVoting) {
      const tx = await walletClient.writeContract({
        abi: contracts.aitoolVoting.abi,
        address: contracts.aitoolVoting.address,
        functionName: 'upvoteTool',
        args: [toolId , "liked"],
        chain: undefined,
        account: address as `0x${string}`
      });

      if (!publicClient) {
        console.error('Public client is not initialized.');
        return;
      }
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log('Tool upvoted successfully:', tx);
      await fetchVotesForTools(); // Refresh votes after upvoting
    }
  };

  const downvoteTool = async (toolId: bigint) => {
    if (!address || !walletClient) {
      console.error('No address or wallet client found. Please connect your wallet.');
      return;
    }

    if (contracts.aitoolVoting) {
      const tx = await walletClient.writeContract({
        abi: contracts.aitoolVoting.abi,
        address: contracts.aitoolVoting.address,
        functionName: 'downvoteTool',
        args: [toolId , "not_liked"],
        chain: undefined,
        account: address
      });

      if (!publicClient) {
        console.error('Public client is not initialized.');
        return;
      }
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log('Tool downvoted successfully:', tx);
      await fetchVotesForTools(); // Refresh votes after downvoting
    }
  };

  const generateFirewallList = async () => {
    if (!walletClient) {
      console.error('No wallet client found. Please connect your wallet.');
      return;
    }

    if (contracts.aifirewallList) {
      const tx = await walletClient.writeContract({
        abi: contracts.aifirewallList.abi,
        address: contracts.aifirewallList.address,
        functionName: 'generateFirewallList',
        args: [],
        chain: undefined,
        account: address as `0x${string}`
      });

      if (!publicClient) {
        console.error('Public client is not initialized.');
        return;
      }
      await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log('Firewall list generated successfully:', tx);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setWalletClient(null);
    setContracts({
      aitoolSubmission: null,
      aitoolVoting: null,
      aifirewallList: null,
    });
    setTools([]);  // Clear tools on disconnect
  };

  return (
    <ContractsContext.Provider value={{
      address,
      connectWallet,
      submitAITool,
      upvoteTool,
      downvoteTool,
      generateFirewallList,
      disconnectWallet,
      tools,
      setTools,
      fetchVotesForTools, // Expose the new function
    }}>
      {children}
    </ContractsContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
};
