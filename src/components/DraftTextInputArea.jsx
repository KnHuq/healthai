import React from "react";
import { Editor, EditorState, CompositeDecorator } from "draft-js";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import "draft-js/dist/Draft.css"; // Basic Draft.js styling

// Function to find and highlight words
const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const highlightStrategy = (contentBlock, callback) => {
  findWithRegex(
    /\b(happy|sad|angry|depressed|delighted)\b/gi,
    contentBlock,
    callback
  );
};

// Custom component for highlighted text
const Highlight = (props) => (
  <span
    style={{
      fontWeight: "bold",
      textDecoration: "underline",
      backgroundColor: "#2575fc",
      color: "white",
    }}
    {...props}
  >
    {props.children}
  </span>
);

const createDecorator = () =>
  new CompositeDecorator([
    {
      strategy: highlightStrategy,
      component: Highlight,
    },
  ]);

class DraftTextInputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty(createDecorator()) };
    this.onChange = this.onChange.bind(this); // Ensure 'this' is correctly bound
  }

  onChange(editorState) {
    this.setState({ editorState });

    // Now, we extract the highlighted text in the onChange method
    const currentContent = editorState.getCurrentContent();
    let plainText = currentContent.getPlainText();
    const wordsToHighlight = /\b(happy|sad|angry|depressed|delighted)\b/gi;
    let match,
      highlightedWords = [];

    while ((match = wordsToHighlight.exec(plainText)) != null) {
      highlightedWords.push(match[0]);
    }

    // Assuming you have a prop function to call when highlighted words change
    if (this.props.onHighlightChange) {
        
        this.props.onHighlightChange(highlightedWords);
        console.log('Highlighted words to send:', highlightedWords);
    }
  }

  render() {
    return (
      <MDBCard
        className="bg-dark text-white my-5 mx-0 "
        style={{
          minWidth: "785px",
          minHeight: "400px",
          maxHeight: "400px",
          transform: "translateX(-40px)",
        }}
      >
        <MDBCardBody className="d-flex flex-column align-items-center mx-auto w-100">
          <h2 className="fw-bold mb-2 text-uppercase">Text Box</h2>
          <p className="text-white-50 mb-3">
            Please enter your text for processing.
          </p>
          <div
            style={{
              backgroundColor: "#fff",
              color: "#000",
              width: "100%",
              minHeight: "17rem",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              overflowY: "auto",
            }}
            className="form-control"
          >
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              placeholder="Type something..."
            />
          </div>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default DraftTextInputArea;
