import React from "react";
import { Editor, EditorState, CompositeDecorator } from "draft-js";
import { MDBCard, MDBCardBody, MDBRow, MDBContainer } from "mdb-react-ui-kit";
import "draft-js/dist/Draft.css";
import axios from "axios"; // Ensure axios is installed for HTTP requests

/**
 * Asynchronously fetch matched words from the backend.
 * @param {string} text The text to be sent for matching.
 * @returns {Promise<Array>} A promise that resolves to an array of match objects.
 */
const getMatchedWordsFromBackend = async (text) => {
  try {
    const response = await axios.post("http://localhost:8080/match-words", {
      text,
    });
    console.log('text: ', text)
    // Assumes the backend returns an object with a 'matches' array
    return response.data.matches;
  } catch (error) {
    console.error("Error fetching matched words:", error);
    return []; // Return an empty array in case of error
  }
};

/**
 * React component for text input with highlighting of words matched by a backend.
 */
class BackendTextInputArea extends React.Component {
  constructor(props) {
    super(props);

    // Binding highlightStrategy to ensure 'this' refers to the component instance
    this.highlightStrategy = this.highlightStrategy.bind(this);

    // Initial decorator setup, which will be updated dynamically
    const decorator = new CompositeDecorator([
      {
        strategy: this.highlightStrategy,
        component: Highlight,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      matches: [], // Initialize matches as an empty array
    };
  }

  /**
   * Fetches updated matches from the backend whenever the component updates.
   */
  componentDidMount() {
    this.updateMatches();
  }

  /**
   * Calls the backend to get matches for the current text, then refreshes the editor.
   */
  updateMatches = async () => {
    const text = this.state.editorState.getCurrentContent().getPlainText();

    const matches = await getMatchedWordsFromBackend(text);
    const highlightedwords = matches.map((match) => ({
      //text.slice(match.start, match.end),
      word: text.slice(match.start, match.end),
      category: match.category,
    })); // Extract words from text based on match indices
    this.setState({ matches }, () => {
      this.refreshEditor();
      this.props.onHighlightUpdate(highlightedwords); // Call the callback with the highlighted words
    });
  };

  /**
   * Refreshes the editor's decorator with the latest matches for highlighting.
   */
  refreshEditor = () => {
    const decorator = new CompositeDecorator([
      {
        strategy: this.highlightStrategy.bind(this),
        component: Highlight,
      },
    ]);
    const newEditorState = EditorState.set(this.state.editorState, {
      decorator,
    });
    this.setState({ editorState: newEditorState });
  };

  /**
   * Strategy function for Draft.js to find text ranges that should be highlighted.
   * Uses the current matches from the component's state.
   */
  highlightStrategy(contentBlock, callback) {
    this.state.matches.forEach((match) => {
      callback(match.start, match.end);
    });
  }

  render() {
    return (
      <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
        <MDBCard
          className="bg-dark text-white my-5 mx-0 "
          style={{
            minWidth: "42.90vw",
            //minWidth: "42.90vw",
            //minWidth: "785px",
            minHeight: "47.80vh",
            //maxHeight: "400px",
            transform: "translateX(-40px)",
            borderRadius: "1rem",
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
                minwidth: "20rem",
                maxWidth: '45rem',
                minHeight: "20rem",
                //padding: "6px 12px",
                //borderRadius: "4px",
                //border: "1px solid #ced4da",
                overflowY: "auto",
              }}
              className="form-control"
            >
              {/* onChange updated to use the editor state directly */}
              <Editor
                editorState={this.state.editorState}
                onChange={(editorState) =>
                  this.setState({ editorState }, this.updateMatches)
                }
                placeholder="Type something..."
              />
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    );
  }
}

/**
 * Component to render the highlighted portion of text.
 */
const Highlight = (props) => (
  <span
    style={{
      //fontWeight: "bold",
      textDecoration: "underline",
      textDecorationColor: "#00FF00",
      textDecorationThickness: "0.20em"
      //backgroundColor: "#2575fc",
      //color: "white",
    }}
  >
    {props.children}
  </span>
);

export default BackendTextInputArea;
