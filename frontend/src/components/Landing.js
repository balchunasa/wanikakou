import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const levels = ["death", "hell", "painful", "paradise", "pleasant", "reality", "challenge"];

function Landing() {
    const [level, setLevel]          = useState("pleasant");
    const [startIdx, setStartIdx]    = useState(0);
    const [endIdx, setEndIdx]        = useState(0);
    const [numKanji, setNumKanji]  = useState(0);
    const [randomize, setRandomize]  = useState(false);
    const [file, setFile]            = useState(null)

    const navigate = useNavigate();

    function readFile(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsText(file);
        });
    }

    function handleFileInput(e) {
      setFile(e.target.files[0]);
    }

    function handleNumKanji(e) {
        setNumKanji(e.target.value);
    }

    function handleLevelSelect(e) {
        setLevel(e.target.value);
    }
    
    function handleRandomize(e) {
        setRandomize(e.target.value);
    }

    function handleStartIdx(e) {
        setStartIdx(parseInt(e.target.value));
    }

    function handleEndIdx(e) {
        setEndIdx(parseInt(e.target.value));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (validate()) {
            let content = "";
            if (file !== null) {
                try{
                    content = await readFile(file);
                }
                catch (error) {
                    console.log(error);
                }
            }

            const res = await fetch("/loadKanji", { 
                "method": "POST", 
                "headers": { "Content-Type": "application/json" }, 
                "body": JSON.stringify({"level": level, "startIdx": startIdx, "endIdx": endIdx, "numKanji": numKanji, "randomize": randomize, "fileContent": content})
            });

            const data = await res.json();
            
            if (res.status === 200) 
                navigate("/train", { "state": { "kanjiList": data.kanjiList } });
            else
                navigate("/error", { "state": { "message": data.message, "missingKanji": data.missingKanji } });
        }
    }


    function validate() {
        if (!levels.includes(level)) {
            const error = `${level} is not a valid wanikani level. Please reload the app.`;
            navigate("/error", { "state": { "message": error }});
            return false;
        }
        else if (startIdx < 0) {
            const error = `StartIdx must be >= 0. Yours was ${startIdx}.`;
            navigate("/error", { "state": { "message": error }});
            return false;
        }
        else if (endIdx < -1) {
            const error = `EndIdx must be >= -1. Yours was ${startIdx}.`;
            navigate("/error", { "state": { "message": error }});
            return false;
        }
        else if (numKanji < 0) {
            const error = `Num Kanji must be a positive integer that's less than the total number of kanji. Yours was ${numKanji}.`
            navigate("/error", { "state": { "message": error }});
        }
        else if (startIdx > endIdx && endIdx !== -1) {
            const error = `StartIdx must be >= EndIdx. StartIdx was ${startIdx} and EndIdx was ${endIdx}.`;
            navigate("/error", { "state": { "message": error }});
            return false;
        }

        return true;
    }

    return (
        <Container className="mt-5 d-flex flex-column" style={{"height": "100vh"}}>
            <h1 className="text-center">鰐書こう！</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="wk-level">
                <Form.Label>Wanikani Level</Form.Label>
                <Form.Select onChange={handleLevelSelect}>
                <option value="pleasant">Pleasant</option>
                <option value="painful">Painful</option>
                <option value="death">Death</option>
                <option value="hell">Hell</option>
                <option value="reality">Reality</option>
                <option value="paradise">Paradise</option>
                <option value="challenge">Challenge</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="start-idx">
                <Form.Label>Starting Index</Form.Label>
                <Form.Control onChange={handleStartIdx} placeholder="0" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Ending Index</Form.Label>
                <Form.Control onChange={handleEndIdx} placeholder="0" />
                <Form.Text>-1 to go to the end</Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label>Number of Kanji</Form.Label>
                <Form.Control onChange={handleNumKanji} placeholder="0" />
                <Form.Text>0 for all</Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Check className="mt-3" onChange={handleRandomize} value={randomize} label="Randomize?"/>
                <Form.Text>Randomize Input?</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" onChange={handleFileInput}>
                <Form.Label>Upload your own file with each kanji on it's own line</Form.Label>
                <Form.Control type="file" size="sm" />
            </Form.Group>
            <Button className="mt-3" type="submit">
                Submit
            </Button>
        </Form>
        </Container>
    );
}

export default Landing;