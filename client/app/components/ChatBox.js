import { useEffect, useRef, useState } from "react";
import { createAnswer } from "../api";
import lodash from 'lodash';
import { Button, Tooltip } from "antd";
import axios from "axios";
import { ReloadOutlined} from '@ant-design/icons';
import { v4 as uuid } from 'uuid';
import { TYPE } from "../type";

const BotText = ({ text, isReload = false, onClick }) => {
  return (
    <div className="chat-message">
       <div className="flex items-end">
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
             <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                {isReload &&<div className="text-right" onClick={onClick}>
                  <Tooltip title="regenerate">
                    <ReloadOutlined className="hover:cursor-pointer my-fourth-step" />
                  </Tooltip>
                
                </div>}
                <p>
                {text}
                </p>
                </span></div>
          </div>
          <img src="chat-gpt-logo.jpeg" alt="My profile" className="w-6 h-6 rounded-full order-1" />
       </div>
    </div>
  )
}

const PersonText = ({text}) => {
  return (
    <div className="chat-message">
    <div className="flex items-end justify-end">
       <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{text}</span></div>
       </div>
       {/* <img src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="My profile" className="w-6 h-6 rounded-full order-2" /> */}
    </div>
 </div>
  )
}

/**
 * Lock khi chờ response
 * @param {*} param0 
 * @returns 
 */
const ChatBox = ({ collapsed, setCollapsed, isMobile, data, setData}) => {
  const [inputData, setInputData] = useState('');
  const [inputDataSubmit, setInputDataSubmit] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  // Create an AbortController instance
  const controller = new AbortController();
  const [kill, setKill] = useState(false);
  const [answer, setAnswer] = useState('');
  const [lastBot, setLastBot] = useState('2');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [data?.length]);

  useEffect(() => {
    console.log({answer});
    if (loading && answer) {
      const curr = JSON.parse(JSON.stringify(data));
        const id = uuid();
        setLastBot(id);
        curr.push({
        id,
        type: TYPE.BOT,
        text: answer
      })
      setData(curr); 
      setLoading(false);
    }
  }, [answer])

  const SubmitText = async () => {
    if (inputDataSubmit) {
      setLoading(true);
      setInputData('');
      const currInputData = lodash.cloneDeep(inputDataSubmit);

      const curr = JSON.parse(JSON.stringify(data));

      curr.push({
        id: uuid(),
        type: TYPE.PERSON,
        text: currInputData
      })

      setData(curr);

      const res = await createAnswer({text: currInputData, controller});

      setAnswer(res?.data[0]?.text);
    }

    setInputDataSubmit('');
  }



  return (
    <>
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
 <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
    <div className="relative flex items-center space-x-4">
       <div className="relative">
          {/* <span className="absolute text-green-500 right-0 bottom-0">
             <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
             </svg>
          </span> */}
          <img src="chat-gpt-logo.jpeg" alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full my-fifth-step" onClick={() => {
          
              if (!collapsed) setCollapsed(!collapsed);
            
          }} />
       </div>
       <div className="flex flex-col leading-tight">
          <div className="text-xl mt-1 flex items-center">
             <span className="text-gray-700 mr-3">ChatGPT</span>
          </div>
       </div>
    </div>
    {/* <div className="flex items-center space-x-2">
       <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
       </button>
       <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
       </button>
       <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
       </button>
    </div> */}
 </div>
 <div id="messages" className="h-full flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
   {data?.map((item, idx) => {
    if (item?.type === TYPE.PERSON) return <PersonText key={idx} text={item?.text} />

    return <BotText key={idx} text={item?.text} isReload={lastBot === item?.id && !loading} onClick={async () => {
      const findIndex = (data || []).findIndex((item) => item?.id?.toString() === lastBot?.toString());

      if (findIndex > -1) {
        const currData = JSON.parse(JSON.stringify(data));
        
        const text = currData[findIndex - 1]?.text;

        setData(currData.filter((_, idx) => idx?.toString() !== findIndex?.toString()));

        if (text) {
          setLoading(true);
          setInputData('');
          const currInputData = lodash.cloneDeep(text);
          
          const res = await createAnswer({text: currInputData, controller});

          console.log(res);
    
          setAnswer(res?.data?.choices[0]?.message?.content);
        }
    
        setInputDataSubmit('');
      }
    }} />
   })}
   {loading && <BotText key="loading" text="loading..." />}
   <div ref={messagesEndRef} />
 </div>
  <div className="text-center mb-2 my-third-step"><Button className="bg-white" onClick={() => {
    // console.log('onClick');
    // controller.abort();
    setLoading(false);
   
  }}>
      Stop
    </Button></div>
 <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
    <div className="relative flex">
       {/* <span className="absolute inset-y-0 flex items-center">
          <button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
             </svg>
          </button>
       </span> */}
       <input
      disabled={loading}
       onKeyDown={async (e) => {
        if (e.key === 'Enter') {
          await SubmitText();
        }
       }} value={inputData} onChange={(e) => {
        setInputData(e?.target?.value);
        setInputDataSubmit(e?.target?.value);
       }} type="text" placeholder="Write your message!" 
       className={`my-first-step w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 ${loading && 'bg-gray-500' || 'bg-gray-200'} rounded-md py-3`} />
       <div 
       className="absolute right-0 items-center inset-y-0 hidden sm:flex"
       >
          <button type="button" className="my-second-step inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
             <span className="font-bold" onClick={async () => {
             await SubmitText();
             }}>Send</span>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
             </svg>
          </button>
       </div>
    </div>
 </div>
</div>
  </>
  )
}

export default ChatBox;