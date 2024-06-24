import { useState, useEffect, useContext } from 'react';
import styles from "../styles/Profile.module.css";
import BuyScreen from "./buy_screen";
import { useMutation, useQueryClient } from 'react-query';
import { AssignReaders } from '@/utils/assignReaders';
import { uploadScreenplay } from '@/lib/Screenplay/uploadScreenplay';
import { getTransactionDetails } from '@/lib/Transaction/getTransaction';
import { getUserScreenplays } from '@/lib/Screenplay/Sphelpers';
import { UserContext } from '@/store/CognitoUser/CognitoUserContext';

export default function SPPayment(props) {

  const [walletData, setWalletData] = useState(null);
  const queryClient = useQueryClient()
  

  const addMutation = useMutation(uploadScreenplay, {
    onSuccess: (data) => {
      queryClient.setQueryData(["UserscreenplayData", props.formData.user_id], data);
      queryClient.prefetchQuery(['UserscreenplayData', props.formData.user_id], () => getUserScreenplays(props.formData.user_id));
      AssignReaders(data?.data?.rows[0]);
      // props.onCancel();
    }
  });
  
  const handleSPUpload = () => {
    addMutation.mutate(props.formData);
  };

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const data = await getTransactionDetails(props.user_id);
        setWalletData(data?.data.rows[0]);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData();
  }, []);
  return (
    <>
      <style jsx>
        {`
          * {
            color: white;
            font-family: courier;
          }

          hr {
            // width: 100px;
            // margin: auto;
            // height: 3px;
            // background-color: #f3ae09;
            // border: none;
            // opacity: 1;
          }
          .card_res{
            margin-right:0px !important;
            margin-left:0px !important;
          }
          
          

          input.input-box,
          textarea {
            background: black;
            border-color: black;
          }

          input.input-box,
          input {
            background: black;
            border-color: black;
            padding: 12px 10px 12px 10px;
          }

          ::placeholder {
            color: #b8b8b8;
            opacity: 1;
          }

          :-ms-input-placeholder {
            color: #b8b8b8;
          }

          ::-ms-input-placeholder {
            color: #b8b8b8;
          }
        `}
      </style>
      <div className={styles.bg_black}>
        <div className="">
          <div className="row card_res" style={{ background: "black" }}>
            {/* <div className="col-12 text-center text-black">
              <h1>Upload Screenplay</h1>
            </div>

            <div className={`row text-center ${styles.step_row_res}`}>
              
              <div className={`col-lg-3 ml-5 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle}`}>1</h4>{" "}
                <h4 className={`${styles.step_res}`}>Information</h4>
                <h3 className={`${styles.step_arrow}`}>&gt;</h3>
              </div>
              <div className={`col-lg-2 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle}`}>2</h4>{" "}
                <h4 className={`${styles.step_res}`}>Payment</h4>
                <h3 className={`${styles.step_arrow}`}>&gt;</h3>
              </div>
              <div className={`col-lg-2 ${styles.step_row}`}>
                <h4 className={`${styles.step_circle_disable}`}>3</h4>{" "}
                <h4 className={`${styles.step_res}`}>Preview</h4>
              </div>
              
            </div> */}

            <BuyScreen
              onClose={props.onCancel}
              amount={1000}
              balance={walletData?.balance}
              title={"Upload Screenplay"}
              sucsessMethod={handleSPUpload}
              sp_id={-1}
              onBack={props.prevStep}
              user_id={props.user_id}
              prevStep = {props.prevStep}
            />
          </div>
        </div>
      </div>
    </>
  );
}
