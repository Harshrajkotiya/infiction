import Book from "@/components/book";
import React, { useRef } from "react";

export default function community_guideline() {
  const htmlString =
    "<p>Welcome to our screenwriting community! Our platform is a space where screenwriters can upload their scripts, receive feedback, and potentially get discovered by producers looking for new content. To make sure everyone has a positive and productive experience on our platform, we have established the following community guidelines: <br/><br/><b> Respect and Civility: </b> <br /> We expect all members to behave professionally and respectfully towards each other. Any form of harassment, hate speech, or discrimination will not be tolerated. <br /><br/><b> Feedback and Evaluation: </b> <br /> Our platform is designed to provide screenwriters with valuable feedback and evaluation to help them improve their craft. Our feedback and evaluation process is thorough and has been vetted by industry professionals. We strive to provide accurate and helpful feedback to our members.</p>";
  const htmlString1 = 
  "It's important to note that our ratings are final, and we reserve the right to make the final decision regarding the evaluation of a script. While we welcome discussion and further questions regarding the feedback provided, we cannot entertain disputes regarding our ratings. <br/><br/> <b> Intellectual Property:</b> <br /> Only upload scripts that you have written and own the copyright to. Do not upload scripts that infringe on   the intellectual property rights of others.<br/><br/>Plagiarism will not be to lerated, and any member found to have violated this guideline will be  removed from the platform.<br /><br/> <b> Accuracy of Information: </b><br /> Please provide accurate and truthful information about your scripts and any other information you provide on our platform. Any member found to have violated this guideline will be removed from the platform."
  const htmlString2 =
  "<b> Professionalism: </b> <br /> Our platform is a professional space, and we expect members to conduct themselves accordingly. Please refrain from using profanity or engaging in unprofessional behaviour. <br /><br/> <b> Public Platform: </b> <br /> Please be aware that our platform is public, and any scripts uploaded can be accessed by selected members (producers) of the platform. If you are concerned about confidentiality or do not want others to see your work, do not upload it to the platform.<br/><br/><b> Marketplace Guidelines: </b> <br /> As a buyer on our platform, we want to ensure that you have access to high-quality scripts that meet your expectations. Therefore, make sure to double check before buying a script. A script once sold cannot be returned. However, you can re-list it on the marketplace. Be sure to read thoroughly the synopsis, logline etc. before buying the script."
  const htmlString3 = 
  "If you have any questions or concerns about a particular script or the marketplace guidelines, please feel free to reach out to our support team for assistance. We are here to help you find the perfect script for your needs. <br /><br/> <b> Copyright: </b> <br /> As the owner of your script's copyright, you have the right to decide who can use your work. By uploading your script to our platform, you grant us a non-exclusive, royalty-free license to display and distribute your work for the purpose of promoting it on our platform and providing evaluation services. You also acknowledge that other members may have access to your work and that you are responsible for protecting your own intellectual property rights. <br/><br/> <b> Report any violations: </b> <br /> If you see any violations of our community guidelines, please report them to our moderation team."  
  const htmlString4 =
  "We take all reports seriously and will take appropriate action. We hope these guidelines will help create a positive and productive community for screenwriters and industry professionals. Happy writing!"


  const divRefs = Array.from({ length: 8 }, () => useRef(null));

  return (
    <div style={{ textAlign: "center" }}>
      <Book
        title="COMMUNITY GUIDELINES"
        content={htmlString}
        content2={htmlString1}
        content3={htmlString2}
        content4={htmlString3}
        content5={htmlString4}
        length={8}
        divRefs={divRefs}
      />
    </div>
  );
}
