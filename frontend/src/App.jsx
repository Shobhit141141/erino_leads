import './App.css'
import { toast } from 'react-toastify';
import { Button } from '@mantine/core';
function App() {
  const handleClick = () => {
    toast.success('Button clicked!');
  };
  return (
    <>
      <Button onClick={handleClick}>
        Hello there
      </Button>
    </>
  )
}

export default App
