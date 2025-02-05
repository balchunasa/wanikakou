import { useLocation } from "react-router-dom";
import { Link } from "react-router";
import { Container, Row, Table } from "react-bootstrap";

function Results() {
    const location = useLocation();

    let results = location.state.results;

    results = Object.entries(results).sort(([, valueA], [, valueB]) => {
        return valueB - valueA;
    });

    let numFirstTry = 0;

    results.forEach(result => {
        if (result[1] === 1) numFirstTry++;
    });

    const pctCorrect = Math.round(numFirstTry / results.length * 100, 2);

    return (
        <Container className="d-flex align-items-center flex-column">
            <Row>
            <h1>Results!</h1>
            </Row>
            <Row>
                <Link to="/">Back to Start</Link>
            </Row>
            <Row>
                <span>You got {numFirstTry} / {results.length} = {pctCorrect}% correct on your first try!</span>
            </Row> 
            <Row className="d-flex">
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th>Kanji</th>
                            <th>Counts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, index) => (
                            <tr key={index}>
                                <td key={2*index}>{row[0]}</td>
                                <td key={2*index + 1}>{row[1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
        </Row>
        </Container>
    );
}

export default Results;