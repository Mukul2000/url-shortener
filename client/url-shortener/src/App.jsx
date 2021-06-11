import './App.css';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [res, setResult] = useState();
  const [url, setUrl] = useState('');
  const domainName = 'localhost:8000';

  async function handleSubmit() {
    try {
      const response = await axios.post('http://localhost:8000/shortUrls', {
        fullUrl: url,
      });
      console.log(response.data);
      setResult(response.data);
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container">
      <h1>URL Shrinker</h1>
      <input required placeholder="Enter url" value={url} onChange={(e) => setUrl(e.target.value)} type="url" name="fullUrl" id="fullUrl" className="form-control col mr-2 mb-2" />
      <Button className="btn btn-success" onClick={handleSubmit}>Shrink</Button>

      {res ? <div className='link-primary'> <a href={`http://www.${domainName}/${res}`}> Your shortened url is : {domainName}/{res} </a></div> : null}
    </div>
  );
}

