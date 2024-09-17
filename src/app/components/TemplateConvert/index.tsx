import { Html } from "@react-email/components";
import xss from "xss";

const TemplateConvert: React.FC<any> = ({ htmlText }) => {
  const cleanHtml = xss(htmlText);

  console.log(cleanHtml);
  

  return (
      <Html lang="pt-BR">
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </Html>
  );
};

export default TemplateConvert;
