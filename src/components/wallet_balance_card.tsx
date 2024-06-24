import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function WalletBalance() {
    return (
        <Card style={{ width: '95%', backgroundColor: "#292929" }}>
            <Card.Body>
                <Card.Subtitle className="mb-2 text-light"><img className='me-2' src="../wallet_balance_icon.svg" alt="wallet_balance_icon" /> My Wallet Balance</Card.Subtitle>
                <h2 style={{ color: "#F3AE09" }}>₹12,2345.78</h2>
                <Card.Text className="text-light">
                    +546t.33
                </Card.Text>
                <div className="btn_style d-flex justify-content-between">
                    <Button variant="outline-light" size="lg">Receive</Button>
                    <Button variant="outline-light" size="lg">Send</Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default WalletBalance;