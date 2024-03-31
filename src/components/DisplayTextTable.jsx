import React, { useEffect, useState } from "react";
import { MDBRow, MDBCard, MDBCardBody,  MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

const DisplayTextTable = ({ highlightedwords }) => {
  const [categoriesWithWords, setCategoriesWithWords] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const wordCategories = await Promise.all(
          highlightedwords.map(async (word) => {
            const response = await fetch(
              `http://localhost:5000/category?word=${word}`
            );
            const data = await response.json();
            return { word, category: data.category };
          })
        );

        const updatedCategories = wordCategories.reduce(
          (acc, { word, category }) => {
            acc[category] = acc[category] ? [...acc[category], word] : [word];
            return acc;
          },
          {}
        );

        setCategoriesWithWords(updatedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (highlightedwords && highlightedwords.length > 0) {
      fetchCategories();
    } else {
      // Ensure the state is cleared when there are no highlighted words.
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
          <h2 className="fw-bold mb-2 text-uppercase Text-center">
            Highlighted Text and Categories
          </h2>
          <br />
          <MDBTable bordered borderColor="primary" style={{ color: "white" }}>
            <MDBTableHead>
              <tr>
                <th scope='col-xl'>Category</th>
                <th scope='col-xl'>Words</th>
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
          {Object.keys(categoriesWithWords).length === 0 && (
            <p className="text-white-50 mb-3">No highlighted text.</p>
          )}
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default DisplayTextTable;
