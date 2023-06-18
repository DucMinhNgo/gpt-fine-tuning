'use client';
import Image from 'next/image'
import styles from './page.module.css'
import ChatBox from './components/ChatBox'
import LayoutComponent from './components/Layout'
import ReactJoyride from 'react-joyride';

export default function Home() {
  return (
   <div className='h-screen'>
    <ReactJoyride
          key="ReactJoyride"
          steps={[
            {
               target: '.my-first-step',
               content: 'Nhập thông tin cần chat, sau đó nhấn Enter để gửi tin nhắn!',
             },
            //  {
            //    target: '.my-second-step',
            //    content: 'Nhấn Send để gửi!',
            //  },
             {
               target: '.my-third-step',
               content: 'Nhấn vào để dừng câu trả lời!',
             },
             {
               target: '.my-fourth-step',
               content: 'Nhấn vào để regenerate (tạo lại câu trả lời)!',
             },
             {
               target: '.my-fifth-step',
               content: 'Nhấn vào để mở menu (nhấn ra ngoài menu để đóng)!',
             },
             {
              target: '.my-sixth-step',
              content: 'Nhấn vào để xóa tin nhắn cũ!',
            }, 
          ]}
        />
    <LayoutComponent />
   </div>
  )
}
