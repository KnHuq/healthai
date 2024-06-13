import React, { useEffect, useState } from "react";
import {
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import axios from "axios";

const DisplayTextTable = ({ highlightedwords }) => {
  const [categories, setCategories] = useState({});
  const [categoriesWithWords, setCategoriesWithWords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch category names from the backend when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categories");
        setCategories(response.data.categories); // Assumes the backend returns an object with a 'categories' object
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const groupWordsByCategories = () => {
      const grouped = highlightedwords.reduce((acc, { word, category }) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(word);
        return acc;
      }, {});

      // Merge the categories and grouped words
      const mergedCategories = { ...categories };
      for (const category in grouped) {
        if (grouped.hasOwnProperty(category)) {
          mergedCategories[category] = grouped[category];
        }
      }
      setCategoriesWithWords(mergedCategories);
    };

    if (highlightedwords?.length > 0) {
      groupWordsByCategories();
    } else {
      setCategoriesWithWords(categories);
    }
  }, [highlightedwords, categories]);

  const renderTable = () => {
    if (loading) {
      return <p className="text-white-50 mb-3">Loading categories...</p>;
    }

    if (error) {
      return <p className="text-white-50 mb-3">Error loading categories.</p>;
    }

    if (Object.keys(categories).length === 0) {
      return <p className="text-white-50 mb-3">No categories available.</p>;
    }

    return (
      <MDBTable bordered borderColor="primary" style={{ color: "white" }}>
        <MDBTableHead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Words</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {Object.entries(categoriesWithWords).map(
            ([category, words], index) => (
              <tr key={index}>
                <td>{category}</td>
                <td>{Array.isArray(words) ? words.join(", ") : ""}</td>
              </tr>
            )
          )}
        </MDBTableBody>
      </MDBTable>
    );
  };

  return (
    <MDBRow className="d-flex justify-content-center align-items-center mt-100 vh-100">
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
          {renderTable()}
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  );
};

export default DisplayTextTable;
