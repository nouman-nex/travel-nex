import React from "react";
import { Link } from "react-router-dom";

export default function PageHeader({ image, title, breadcrumb }) {
  return (
    <div>
      <section
        className="breadcrumb-wrapper fix bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="container">
          <div className="row">
            <div className="page-heading">
              <h2>{title}</h2>
              <ul className="breadcrumb-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <i className="fa-solid fa-chevron-right"></i>
                </li>
                <li>{breadcrumb}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
