import { getUserTransactions } from "@/lib/Transaction/getTransaction";
import { useEffect, useState } from "react";

export default function Wallet_transaction_history({ user_id }) {
  const [historyData, setHistoryData] = useState(null);
  useEffect(() => {
    async function fetchHistoryData() {
      try {
        const data = await getUserTransactions(user_id);
        setHistoryData(data?.data?.rows.reverse());
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchHistoryData();
  }, [user_id]);

  return (
    <>
      <div>
        <p
          className="text-center"
          style={{ color: "white", fontSize: "larger" }}
        >
          {historyData && historyData.length === 0
            ? "No Transactions"
            : "Transaction History"}
        </p>
      </div>
      {historyData?.map((item) =>
        item.trx_amount < 0 ? (
          <div
            style={{
              border: "1px solid #666873",
              borderRadius: "5px",
            }}
            className="py-2 px-3 mt-3"
            key={item.id}
          >
            <div className="row">
              <div className="col-md-1 me-3 d-flex justify-content-between align-items-center">
                <img src="../decrease_wallet.svg" alt="decrease_wallet" />
              </div>
              <div className="col-md-10 d-flex justify-content-between align-items-center pe-0">
                <div>
                  <h6 style={{ color: "white" }}>$SIKKA</h6>
                  <h6 style={{ color: "#4F5358" }}>
                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                  </h6>
                </div>
                <div>
                  <h5 style={{ color: "#DD3B3B" }}>{item.trx_amount}</h5>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              border: "1px solid #666873",
              borderRadius: "5px",
            }}
            className="py-2 px-3 mt-3"
            key={item.id}
          >
            <div className="row">
              <div className="col-md-1 me-3 d-flex justify-content-between align-items-center">
                <img src="../increase_wallet.svg" alt="decrease_wallet" />
              </div>
              <div className="col-md-10 d-flex justify-content-between align-items-center pe-0">
                <div>
                  <h6 style={{ color: "white" }}>$SIKKA</h6>
                  <h6 style={{ color: "#4F5358" }}>
                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                  </h6>
                </div>
                <div>
                  <h5 style={{ color: "#1AD765" }}>+{item.trx_amount}</h5>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
