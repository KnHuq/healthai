import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBTable,
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const TaskTableComponent = () => {
  return (
    <MDBCard className="card-tasks bg-dark text-white my-3">
      <MDBCardBody>
        <MDBCardTitle tag="h6" className="title d-inline">
          Tasks(1)
        </MDBCardTitle>
        <p className="card-category d-inline"> today</p>
        <MDBDropdown>
          <MDBDropdownToggle tag="a" className="btn-icon" color="link">
            <i className="tim-icons icon-settings-gear-63" />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem href="#!" onClick={(e) => e.preventDefault()}>
              Action
            </MDBDropdownItem>
            <MDBDropdownItem href="#!" onClick={(e) => e.preventDefault()}>
              Another action
            </MDBDropdownItem>
            <MDBDropdownItem href="#!" onClick={(e) => e.preventDefault()}>
              Something else
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
        <div className="table-full-width table-responsive ">
          <MDBTable>
            <tbody>
              {/* Repeat for each task */}
              <tr className="bg-dark text-white text-center">
                <td className="bg-dark text-white text-center">
                  <MDBCheckbox label="" id="checkbox1" defaultChecked />
                </td>
                <td className="bg-dark text-white text-center">
                  <p className="title ">Update the Documentation</p>
                  <p className="text">
                    Dwuamish Head, Seattle, WA 8:47 AM
                  </p>
                </td>
                <td  className="td-actions text-right bg-dark text-white">
                  <MDBTooltip
                    tag="a"
                    title="Edit Task"
                    wrapperProps={{
                      href: "#!",
                      className: "btn btn-link btn-icon",
                    }}
                  >
                    <i className="tim-icons icon-pencil" />
                  </MDBTooltip>
                </td>
              </tr>
              {/* More tasks */}
            </tbody>
          </MDBTable>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default TaskTableComponent;
