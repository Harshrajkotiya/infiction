import Book from "@/components/book";
import React, { useRef } from "react";

export default function terms_and_conditions() {
  const htmlString =
    "By using our website, you agree to be bound by the following terms and conditions. If you do not agree to these terms and conditions, please do not use our platform.<br /><br /><b> License to Use Website</b> <br /> We grant you a limited, non-exclusive, revocable license to use our website for personal or commercial purposes. This license does not include the right to:<br/><br/><li> Reproduce, duplicate, copy or otherwise exploit material on our website for any purposes.<li> Modify or redistribute any content on our website</li><li>Use our website in a manner that could damage, disable, overburden,or impair our website</li> <li> Use our website for illegal or unauthorized purposes</li></li><br /><b> Restricted Use </b><br />You may not use our website in a manner that violates any applicablelaws or regulations. Additionally, you may not use our website to:";
  const htmlString1 =
  "<li> Harass, intimidate, or threaten other users</li><li>Transmit any material that is unlawful, obscene, defamatory, libellous, or invasive of another’s privacy</li><li> Impersonate any person or entity</li><li> Promote any illegal activity</li><br /><b> User Content </b><br /> You are solely responsible for any content you upload to our website. By uploading content to our website, you grant us a non-exclusive, royalty-free, transferable license to use, reproduce, distribute, display, and modify your content. We reserve the right to remove any content that violates these terms and conditions.<br /><br />  <b>No Warranties</b><br />We make no warranties or representations about the accuracy or completeness of the content on our website. We do not guarantee that our website will be free from errors, viruses, or other harmful components."
    const htmlString2 =
    "<b> Limitations of Liability</b><br /> We are not liable for any damages, including but not limited to direct, indirect, incidental, punitive, and consequential damages, arising from your use of our website. You agree to indemnify and hold us harmless from any claims arising from your use of our website.<br /><br /><b> Other Parties</b> <br /> You acknowledge that our website may contain links to third-party websites. <br/><br/> We are not responsible for the content, accuracy, or privacy practices of these third-party websites.<br /><br /><b> Indemnity</b> You agree to indemnify, defend, and hold us and our affiliates, officers, directors, agents, and employees harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these terms and conditions or your violation of any law or the rights of a third-party.";
  const htmlString3 =
  "<b>Breaches of T&C</b> <br /> We reserve the right to terminate or suspend your access to our website if you breach these terms and conditions. In the event of a breach, we may take legal action to recover any damages incurred.<br /><br /><b> Disputes:</b><br /> Any disputes arising out of or related to these terms and conditions shall be resolved through arbitration in accordance with the rules of the relevant arbitration body. <br/><br/><b> Law and Jurisdiction:</b><br /> These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is based. Any disputes arising out of or related to these terms and conditions shall be subject to the exclusive jurisdiction of the courts of that jurisdiction. <br /> <br /> Thank you for using our website. If you have any questions or concerns about these terms and conditions, please contact us at hello@infictionapp.com"

  const divRefs = Array.from({ length: 6 }, () => useRef(null));

  return (
    <div style={{ textAlign: "center" }}>
      <Book
        title="Terms and Conditions"
        content={htmlString}
        content2={htmlString1}
        content3={htmlString2}
        content4={htmlString3}
        length={6}
        divRefs={divRefs}
      />
    </div>
  );
}
