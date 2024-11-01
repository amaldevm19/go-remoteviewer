
import './Home.css';
import { Link } from 'react-router-dom';


function Home() {
    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Remote Device Viewer</h1>
      <p className="text-xl mb-8">Easily manage and connect to your NVRs and BMS devices.</p>
      <div>
      <Link to="/configuration">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">
          Configure Devices
        </button>
        </Link>
        <Link to="/connect">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2">
          Connect to Devices
        </button>
        </Link>
      </div>
    </div>
    )
}

export default Home
