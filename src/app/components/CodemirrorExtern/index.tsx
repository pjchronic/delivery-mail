import { html } from "@codemirror/lang-html";
import ReactCodeMirror from "@uiw/react-codemirror";

export default function CodeMirrorExtern(rest: any) {
  return (
    <>
      <ReactCodeMirror
        height="200px"
        theme="dark"
        extensions={[html()]}
        {...rest}
      />
    </>
  );
}
