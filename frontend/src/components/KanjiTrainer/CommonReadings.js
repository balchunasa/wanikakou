import { Container, Table } from "react-bootstrap";

function CommonReadings({ readings }) {
    const join = (meanings) => {
        let results = "";
        meanings.forEach(meaning => {
            results += meaning + ", ";
        });
        return results.substring(0, results.length - 2);
    }

    return (
        <Container style={{fontSize: 20}}>
            <Table>
                <thead>
                    <tr>
                    <th>Reading</th>
                    <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                {/* { show 5 most common readings. can move 5 to be larger to show more } */}
                {readings.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                        <td key={2*index}>{join(row.readings)}</td>
                        <td key={2 * index + 1}>{row.percent}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default CommonReadings;