
import {useState} from 'react'

export default function App() {

  const[text, setText] = useState("");
  const[age, setAge] = useState(null);
  const[gender, setGender] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const[cache, setCache] = useState({});

  const handleSubmit = async () =>{
    

    try{
      setIsLoading(true);

      if(cache.hasOwnProperty(text)){
        setAge(cache[text]);
        setGender(cache[text].gender);
        
      }
      else{
        const [ageResponse, genderResponse] = await Promise.all([
          fetch(`https://api.agify.io/?name=${text}`).catch(e => console.log("Error fetching age: ", e)),
          fetch(`https://api.genderize.io/?name=${text}`).catch(e => console.log("Error fetching gender: ", e))
        ]);
        const ageValue = await ageResponse.json();
        const genderValue = await genderResponse.json();
        setCache({
          ...cache,
          [text]: { age: ageValue.age, gender: genderValue.gender }
        });
  
        setAge(ageValue.age);
        setGender(genderValue.gender);
      }

      
    }
    catch{
      console.log("API Error");
    }
    finally{
      setIsLoading(false);
      setText("");
    }

    
    
  }
  
  return(

    <div className="page-container flex">
      <div className = "card flex">
        <div className="form flex">
          <input placeholder="Enter Name" value={text} onChange = {(evt)=>setText(evt.target.value)}/>
          <button onClick={handleSubmit}>Age</button>
        </div>
        {isLoading ? <div>Loading...</div> : <div>{age ?? "--"}</div>}
        {isLoading ? <div>Loading...</div> : <div>{gender ?? "--"}</div>}
      </div>
    </div>
    
  )
}
