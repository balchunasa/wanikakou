import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, ProgressBar, Button } from "react-bootstrap";

import KanjiCanvas from "./KanjiCanvas";
import Wanikani from "./Wanikani";
import Kanji from "./Kanji";
import CommonReadings from "./CommonReadings";

function KanjiTrainer() {

    const location = useLocation();
    const navigate = useNavigate();
    
    function initializeResults(kanjiList) {
        const results = {};

        kanjiList.forEach(kanji => {
            results[kanji.character] = 0;
        });

        return results;
    }

    const [kanjiList, setKanjiList] = useState(location.state.kanjiList);
    const [totalLen, setTotalLen]   = useState(kanjiList.length);
    const [currKanji, setCurrKanji] = useState(kanjiList[0]);
    const [results, setResults]     = useState(() => initializeResults(kanjiList));

    useEffect(() => {
        setResults(prevResults => {
            prevResults[currKanji.character] += 1;
            return prevResults;
        });
    }, [currKanji]);

    useEffect(() => {
        if (kanjiList.length === 0)
            navigate("/results", { "state": { "results": results } });
        else
            setCurrKanji(kanjiList[0]);
    }, [kanjiList]);

    function correct() {
        setKanjiList(prevList => {
            const newList = prevList.filter(kanji => kanji.id !== currKanji.id);
            return newList;
        });
    }

    function incorrect() {
        setKanjiList(prevList => {
            const first = prevList[0];
            prevList = prevList.slice(1);
            prevList.push(first);
            return prevList;
        });
    }

    function handleKeydown(e) {
        if (e.key === "y" || e.key === "Y") correct();
        if (e.key === "n" || e.key === "N") incorrect();
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeydown);
        
        return (() => {
            document.removeEventListener("keydown", handleKeydown);
        });
    });


    return (
        <Container fluid className="d-flex flex-column" style={{height: window.innerHeight}}>
            <Row className="d-flex justify-content-center align-items-center my-4">
                <Col className="text-center" md={3} sm={3}>
                    <Button onClick={incorrect} variant="danger">Incorrect (N)</Button>
                </Col>
                <Col className="text-center" md={6} sm={6}>
                    <h1>Kanji Trainer!</h1>
                    <ProgressBar 
                        now={100 - Math.floor(kanjiList.length / totalLen * 100)}
                        label={`${totalLen - kanjiList.length} / ${totalLen}`}
                    />
                </Col>
                <Col className="text-center" md={3} sm={3}>
                    <Button onClick={correct} variant="success">Correct (Y)</Button>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center my-4 text-center">
                <Wanikani title={currKanji.wanikani_title} meanings={JSON.parse(currKanji.wanikani_meanings)} />
            </Row>
            <Row className="flex-grow-1 d-flex align-items-center justify-content-center mx-3">
                <Col style={{height: "100%"}} className="text-center mx-0" md={3} sm={3}>
                    <Kanji character={currKanji.character} characterPath={JSON.parse(currKanji.character_paths)} />
                </Col>
                <Col style={{height: "100%"}} md={6} sm={6}>
                    <KanjiCanvas drawingPaths={JSON.parse(currKanji.drawing_paths)} />
                </Col>
                <Col style={{ height: "100%"}} className="text-center mx-0" md={3} sm={3}>
                    <CommonReadings readings={JSON.parse(currKanji.kakimashou_popular_readings)} />
                </Col>
            </Row> 
        </Container>
    );
}

export default KanjiTrainer;