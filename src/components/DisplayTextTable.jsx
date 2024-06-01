import React, { useEffect, useState } from "react";
import {
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

const DisplayTextTable = ({ highlightedwords }) => {
  const [categoriesWithWords, setCategoriesWithWords] = useState({});

  useEffect(() => {
    const groupWordsByCategories = () => {
      const grouped = highlightedwords.reduce((acc, { word, category }) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(word);
        return acc;
      }, {});
      setCategoriesWithWords(grouped);
    };

    if (highlightedwords && highlightedwords.length > 0) {
      groupWordsByCategories();
    } else {
      setCategoriesWithWords({});
    }
  }, [highlightedwords]);

  return (
    <MDBRow className="d-flex-justify-content-center align-items-center mt-100 vh-100">
      <MDBCard
        className="bg-dark text-white my-5 mx-0"
        style={{
          borderRadius: "1rem",
          minWidth: "42.90vw",
          minHeight: "48.80vh",
        }}
      >
        <MDBCardBody className="d-flex flex-column align-items-center mx-auto w-100">
          <h2 className="fw-bold mb-2 text-uppercase text-center">
            Highlighted Text and Categories
          </h2>
          <br />
          {Object.keys(categoriesWithWords).length === 0 ? (
            <p className="text-white-50 mb-3">No highlighted text.</p>
          ) : (
            <MDBTable bordered borderColor="primary" style={{ color: "white" }}>
              <MDBTableHead>
                <tr>
                  <th scope="col-xl">Category</th>
                  <th scope="col-xl">Words</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {Object.entries(categoriesWithWords).map(
                  ([category, words], index) => (
                    <tr key={index}>
                      <td>{category}</td>
                      <td>{words.join(", ")}</td>
                    </tr>
                  )
                )}
              </MDBTableBody>
            </MDBTable>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default DisplayTextTable;
