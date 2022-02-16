import React , {useEffect,useState} from 'react';
import {ethers} from 'ethers';

import {contractABI,contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum}= window;              // activate window.ethereum command on console

const getEthereumContract = () => {
   const provider = new ethers.providers.Web3Provider(ethereum);
   const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
   return transactionsContract;
  }
  
 export const TransactionProvider = ({ children }) => {

     const[currentAccount,setCurrentAccount]= useState('');
     const [formData,setFormData]=useState({addressTo:'',amount:'',keyword:'',message:''});
     const[isLoading,setIsLoading]=useState(false);
    const[transactionCount,setTransactionCount]=useState(localStorage.getItem('transactionCount'));
    const[transactions,setTransactions]= useState([])
     const handleChange = (e, name) => {
      setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

        

    // get transactions for gif and blocks
    const getAllTransactions = async () => {
      try {
        if (!ethereum) return alert("Please install MetaMask.");
          const transactionsContract = getEthereumContract();
  
          const availableTransactions = await transactionsContract.getAllTransactions();
  
          const structuredTransactions = availableTransactions.map((transaction) => ({
            addressTo: transaction.receiver,
           addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),            // returning object we want these information but blockchain was guving too much of info keys prototypes etc 
           message: transaction.message,
           keyword: transaction.keyword,
           amount: parseInt(transaction.amount._hex) / (10 ** 18)           //10`s power18  to covert gwei in ethereum
           }));
  
           console.log(structuredTransactions);
  
         setTransactions(structuredTransactions);
        // } else {
        //   console.log("Ethereum is not present");
        // }
      } catch (error) {
        console.log(error);
      }
    };

   // till here for gif and blocks




    const checkIfWalletIsConnect = async () => {                              //if wallet is coonected
        try{
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_accounts" });
    
           if (accounts.length) {
             setCurrentAccount(accounts[0]);
    
            getAllTransactions();                          //calling
      } else {
             console.log("No accounts found");
           }
     } catch (error) {
          console.log(error);
          throw new Error("No ethereum object");
         }
      // console.log(accounts);
    }


    // this func is created for gif 
    const checkIfTransactionsExists = async () => {
      try {
        if (ethereum) {
          const transactionsContract = getEthereumContract();
          const transactionCount = await transactionsContract.getTransactionCount();
  
          window.localStorage.setItem("transactionCount", transactionCount);
        }
      } catch (error) {
        console.log(error);
  
        throw new Error("No ethereum object");
      }
    };



    const connectWallet = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
          setCurrentAccount(accounts[0]);
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };


      const sendTransaction = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
          const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);
       
        await ethereum.request({
               method: "eth_sendTransaction",
              params: [{
                from: currentAccount,
                to: addressTo,
                gas: "0x5208",                      // hex-->gwei(21000)--> ethereum (0.00000021)
                value: parsedAmount._hex,           //0.00001
            }],
           });
        
        
           const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

           setIsLoading(true);
           console.log(`Loading - ${transactionHash.hash}`);
           await transactionHash.wait();
        
           setIsLoading(false);
           console.log(`Success - ${transactionHash.hash}`);
        
              const transactionsCount = await transactionsContract.getTransactionCount();
              setTransactionCount(transactionsCount.toNumber());
        //  } else {
        //    console.log("No ethereum object");
        //   }

                   window.reload()


        }catch(error){
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };
   
   
      useEffect(() => {
        checkIfWalletIsConnect();
        checkIfTransactionsExists();               //for gif
    },[]);

   return(
        <TransactionContext.Provider value={{connectWallet ,currentAccount,formData,handleChange,sendTransaction,transactions,isLoading}}>
            {children}
       </TransactionContext.Provider>
    );
  
     
    }