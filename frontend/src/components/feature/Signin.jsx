import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/zustand/store';

const Signin = () => {
    const { setShowSignin, signinUser, error } = useStore();
    const [inputValues, setInputValues] = useState({
      email: '',
      password: ''
    })

  const handleSignin = async () => {
    await signinUser(inputValues.email, inputValues.password)
    .then((response) => {
      if (response) {
        setShowSignin(false);
      }
    })
    .catch((err) => {
      setInputValues({
        email: '',
        password: ''
      })
      alert(err.response?.data?.message || "Signin failed. Please try again.");
    });
  }

  return (
    <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-[300px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h3 className="text-xl text-gray-200 mb-4">Signin as Admin</h3>
            <Input placeholder="Email" type="email" value={inputValues.email} onChange={(e) => setInputValues(prev => ({...prev, email: e.target.value}))} />
            <Input placeholder="Password" type="password" value={inputValues.password} onChange={(e) => setInputValues(prev => ({...prev, password: e.target.value}))} />
            
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={() => setShowSignin(false)}>Cancel</Button>
              <Button variant="default" onClick={handleSignin}>Signin</Button>
            </div>
          </motion.div>
    </motion.div>
  )
}

export default Signin