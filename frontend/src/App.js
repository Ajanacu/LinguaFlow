import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

const [text,setText]=useState("");
const [translated,setTranslated]=useState("");
const [source,setSource]=useState("auto");
const [target,setTarget]=useState("fr");
const [history,setHistory]=useState([]);

useEffect(()=>{

const old=localStorage.getItem("history");

if(old){

setHistory(JSON.parse(old));

}

},[]);

const translate=async()=>{

if(text.trim()==="") return;

const API = process.env.REACT_APP_API_URL;

const res = await axios.post(
  `${API}/translate`,
  {
    text,
    source,
    target
  }
);

setTranslated(res.data.translated_text);

const newHistory=[
{
input:text,
output:res.data.translated_text
},
...history
].slice(0,5);

setHistory(newHistory);

localStorage.setItem(
"history",
JSON.stringify(newHistory)
);

};

const speak=()=>{

if(!translated) return;

const utterance=new SpeechSynthesisUtterance(translated);

speechSynthesis.speak(utterance);

};

const copy=()=>{

navigator.clipboard.writeText(translated);

alert("Copied!");

};

const download=()=>{

const element=document.createElement("a");

const file=new Blob(
[translated],
{type:"text/plain"}
);

element.href=URL.createObjectURL(file);

element.download="translation.txt";

document.body.appendChild(element);

element.click();

};

const swapLanguages = async () => {

    const oldSource = source;
    const oldTarget = target;
    const oldTranslated = translated;

    // Swap language selections
    setSource(oldTarget);
    setTarget(oldSource === "auto" ? "en" : oldSource);

    // Put translated text into the input box
    setText(oldTranslated);

    // If there is translated text, translate it back
    if(oldTranslated){

        try{

            const res = await axios.post(
                "http://127.0.0.1:8000/translate",
                {
                    text: oldTranslated,
                    source: oldTarget,
                    target: oldSource === "auto" ? "en" : oldSource
                }
            );

            setTranslated(res.data.translated_text);

        }
        catch(err){
            console.log(err);
        }

    }

};

return(

<div className="container">

<h1>🌍 LinguaFlow AI</h1>

<h3>AI-Powered Multilingual Translation Assistant</h3>

<textarea

value={text}

onChange={(e)=>setText(e.target.value)}

placeholder="Enter text here..."

/>

<p>

Characters: {text.length}

</p>

<div className="selectors">

<select

value={source}

onChange={(e)=>setSource(e.target.value)}

>

<option value="auto">🌐 Auto Detect</option>

<option value="en">🇬🇧 English</option>

<option value="hi">🇮🇳 Hindi</option>

<option value="ml">🇮🇳 Malayalam</option>

<option value="fr">🇫🇷 French</option>

<option value="es">🇪🇸 Spanish</option>

</select>

<button onClick={swapLanguages}>

🔄

</button>

<select

value={target}

onChange={(e)=>setTarget(e.target.value)}

>

<option value="en">🇬🇧 English</option>

<option value="hi">🇮🇳 Hindi</option>

<option value="ml">🇮🇳 Malayalam</option>

<option value="fr">🇫🇷 French</option>

<option value="es">🇪🇸 Spanish</option>

</select>

</div>

<button className="translateBtn"

onClick={translate}

>

Translate

</button>

<h2>

Translation

</h2>

<div className="result">

{translated}

</div>

<div>

<button onClick={copy}>

📋 Copy

</button>

<button onClick={speak}>

🔊 Speak

</button>

<button onClick={download}>

📥 Download

</button>

</div>

<h2>

Recent History

</h2>

<div className="history">

{

history.map((item,index)=>(

<div
key={index}
className="historyCard"
>

<b>{item.input}</b>

<br/>

↓

<br/>

{item.output}

</div>

))

}

</div>

</div>

);

}

export default App;
