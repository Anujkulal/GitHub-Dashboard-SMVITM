import React from 'react'
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-4 text-center text-sm bg-gray-900 text-gray-500 shadow-inner">
        © {new Date().getFullYear()} SMVITM <FaGithub className='inline-block'/> Track — Built by Anuj Kulal
    </footer>
  )
}

export default Footer